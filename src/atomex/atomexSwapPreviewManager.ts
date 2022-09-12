import BigNumber from 'bignumber.js';

import type { AtomexProtocolMultiChain, CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency, Disposable } from '../common/index';
import { Mutable, Cache, InMemoryCache } from '../core/index';
import { ExchangeSymbolsProvider, ordersHelper, SymbolLiquidity, symbolsHelper, type OrderPreview } from '../exchange/index';
import type { Swap } from '../swaps/index';
import { converters } from '../utils/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';

interface SwapCurrencyInfos {
  readonly fromCurrencyInfo: CurrencyInfo;
  readonly fromNativeCurrencyInfo: CurrencyInfo;
  readonly toCurrencyInfo: CurrencyInfo;
  readonly toNativeCurrencyInfo: CurrencyInfo;
  readonly isFromCurrencyNative: boolean;
  readonly isToCurrencyNative: boolean;
}

interface UserInvolvedSwapsInfoCurrencySection {
  readonly swaps: readonly Swap[];
  readonly swapIds: ReadonlyArray<Swap['id']>;
  readonly currencyId: string;
  readonly lockedAmount: BigNumber;
}

interface UserInvolvedSwapsInfo {
  readonly [currency: Currency['id']]: UserInvolvedSwapsInfoCurrencySection;
}

interface MutableUserInvolvedSwapsInfoCurrencySection {
  swaps: Swap[];
  swapIds: Array<Swap['id']>;
  currencyId: string;
  lockedAmount: BigNumber;
}

interface MutableUserInvolvedSwapsInfo {
  [currency: Currency['id']]: MutableUserInvolvedSwapsInfoCurrencySection;
}

export class AtomexSwapPreviewManager implements Disposable {
  private readonly swapPreviewFeesCache: Cache = new InMemoryCache({ absoluteExpirationMs: 20 * 1000 });
  private readonly userInvolvedSwapsCache: Cache = new InMemoryCache({ slidingExpirationMs: 30 * 1000 });

  constructor(protected readonly atomexContext: AtomexContext) {
  }

  async getSwapPreview(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): Promise<SwapPreview> {
    const normalizedSwapPreviewParameters = this.normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters);
    const swapCurrencyInfos = this.getSwapCurrencyInfos(normalizedSwapPreviewParameters.from, normalizedSwapPreviewParameters.to);

    return this.getSwapPreviewInternal(normalizedSwapPreviewParameters, swapCurrencyInfos);
  }

  // TODO: Temporarily. Remove this method when we add local swap tracking
  clearCache() {
    this.swapPreviewFeesCache.clear();
    this.userInvolvedSwapsCache.clear();
  }

  async dispose(): Promise<void> {
    this.clearCache();
  }

  protected normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): NormalizedSwapPreviewParameters {
    return AtomexSwapPreviewManager.isNormalizedSwapPreviewParameters(swapPreviewParameters)
      ? swapPreviewParameters
      : AtomexSwapPreviewManager.normalizeSwapPreviewParameters(
        swapPreviewParameters,
        this.atomexContext.providers.exchangeSymbolsProvider,
        { redeemEnabled: true, refundEnabled: true }
      );
  }

  protected getSwapCurrencyInfos(fromCurrencyId: Currency['id'], toCurrencyId: Currency['id']): SwapCurrencyInfos {
    const fromCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(fromCurrencyId);
    if (!fromCurrencyInfo)
      throw new Error(`The "${fromCurrencyId}" currency (from) is unknown`);
    const toCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(toCurrencyId);
    if (!toCurrencyInfo)
      throw new Error(`The "${toCurrencyId}" currency (to) is unknown`);
    const fromNativeCurrencyInfo = this.atomexContext.providers.blockchainProvider.getNativeCurrencyInfo(fromCurrencyInfo.currency.blockchain);
    if (!fromNativeCurrencyInfo)
      throw new Error(`The "${fromCurrencyInfo.currency.id}" currency is a currency of unknown blockchain: ${fromCurrencyInfo.currency.blockchain}`);
    const toNativeCurrencyInfo = this.atomexContext.providers.blockchainProvider.getNativeCurrencyInfo(toCurrencyInfo.currency.blockchain);
    if (!toNativeCurrencyInfo)
      throw new Error(`The "${toCurrencyInfo.currency.id}" currency is a currency of unknown blockchain: ${toCurrencyInfo.currency.blockchain}`);


    return {
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
      isFromCurrencyNative: fromCurrencyInfo.currency.id === fromNativeCurrencyInfo.currency.id,
      isToCurrencyNative: toCurrencyInfo.currency.id === toNativeCurrencyInfo.currency.id
    };
  }

  protected async getSwapPreviewInternal(
    swapPreviewParameters: NormalizedSwapPreviewParameters,
    swapCurrencyInfos: SwapCurrencyInfos
  ): Promise<SwapPreview> {
    const availableLiquidity = await this.atomexContext.managers.exchangeManager.getAvailableLiquidity({
      type: swapPreviewParameters.type,
      symbol: swapPreviewParameters.exchangeSymbol.name,
      side: swapPreviewParameters.side
    });
    if (!availableLiquidity)
      throw new Error(`No available liquidity for the "${swapPreviewParameters.exchangeSymbol.name}" symbol`);

    const errors: Mutable<SwapPreview['errors']> = [];
    const warnings: Mutable<SwapPreview['warnings']> = [];

    const actualOrderPreview = await this.atomexContext.managers.exchangeManager.getOrderPreview(swapPreviewParameters);
    if (!actualOrderPreview)
      errors.push({ id: 'not-enough-liquidity' });

    const fees = await this.calculateSwapPreviewFees(swapCurrencyInfos, swapPreviewParameters.watchTower);
    const swapPreviewAccountData = await this.getSwapPreviewAccountData(
      swapPreviewParameters,
      actualOrderPreview,
      availableLiquidity,
      swapCurrencyInfos,
      fees,
      errors,
      warnings
    );

    return {
      type: swapPreviewParameters.type,
      from: {
        currencyId: swapPreviewParameters.from,
        price: actualOrderPreview ? actualOrderPreview.from.price : availableLiquidity.from.price,
        address: swapPreviewAccountData.fromAddress,
        actual: actualOrderPreview
          ? {
            amount: actualOrderPreview.from.amount,
            price: actualOrderPreview.from.price,
          }
          : {
            amount: swapPreviewParameters.isFromAmount ? swapPreviewParameters.amount : new BigNumber(0),
            price: new BigNumber(0)
          },
        available: {
          amount: availableLiquidity.from.amount,
          price: availableLiquidity.from.price
        },
        max: swapPreviewAccountData.maxOrderPreview && {
          amount: swapPreviewAccountData.maxOrderPreview.from.amount,
          price: swapPreviewAccountData.maxOrderPreview.from.price
        }
      },
      to: {
        currencyId: swapPreviewParameters.to,
        price: actualOrderPreview ? actualOrderPreview.to.price : availableLiquidity.to.price,
        address: swapPreviewAccountData.toAddress,
        actual: actualOrderPreview
          ? {
            amount: actualOrderPreview.to.amount,
            price: actualOrderPreview.to.price,
          }
          : {
            amount: !swapPreviewParameters.isFromAmount ? swapPreviewParameters.amount : new BigNumber(0),
            price: new BigNumber(0)
          },
        available: {
          amount: availableLiquidity.to.amount,
          price: availableLiquidity.to.price
        },
        max: swapPreviewAccountData.maxOrderPreview && {
          amount: swapPreviewAccountData.maxOrderPreview.to.amount,
          price: swapPreviewAccountData.maxOrderPreview.to.price
        }
      },
      symbol: swapPreviewParameters.exchangeSymbol.name,
      side: swapPreviewParameters.side,
      fees,
      errors,
      warnings
    };
  }

  protected async getSwapPreviewAccountData(
    _swapPreviewParameters: NormalizedSwapPreviewParameters,
    actualOrderPreview: OrderPreview | undefined,
    availableLiquidity: SymbolLiquidity,
    swapCurrencyInfos: SwapCurrencyInfos,
    swapPreviewFees: SwapPreview['fees'],
    errors: Mutable<SwapPreview['errors']>,
    _warnings: Mutable<SwapPreview['warnings']>
  ): Promise<{ fromAddress?: string; toAddress?: string; maxOrderPreview?: OrderPreview }> {
    const [fromAddress, toAddress] = await Promise.all([
      this.atomexContext.managers.walletsManager.getWallet(undefined, swapCurrencyInfos.fromCurrencyInfo.currency.blockchain)
        .then(wallet => wallet?.getAddress()),
      this.atomexContext.managers.walletsManager.getWallet(undefined, swapCurrencyInfos.toCurrencyInfo.currency.blockchain)
        .then(wallet => wallet?.getAddress()),
    ]);
    let maxOrderPreview: OrderPreview | undefined;

    const authorizedFromAddress = fromAddress && this.atomexContext.managers.authorizationManager.getAuthToken(fromAddress) ? fromAddress : undefined;
    const authorizedToAddress = toAddress && this.atomexContext.managers.authorizationManager.getAuthToken(toAddress) ? toAddress : undefined;

    const userInvolvedSwapsInfo = await this.getUserInvolvedSwapsInfo(
      authorizedFromAddress,
      authorizedToAddress,
      swapCurrencyInfos
    );
    if (authorizedFromAddress) {
      let fromCurrencyBalance = await this.atomexContext.managers.balanceManager.getBalance(authorizedFromAddress, swapCurrencyInfos.fromCurrencyInfo.currency);
      let fromNativeCurrencyBalance = swapCurrencyInfos.isFromCurrencyNative
        ? fromCurrencyBalance
        : await this.atomexContext.managers.balanceManager.getBalance(authorizedFromAddress, swapCurrencyInfos.fromNativeCurrencyInfo.currency);
      if (!fromCurrencyBalance || !fromNativeCurrencyBalance)
        throw new Error('Can not get from currency balances');

      const initialFromCurrencyBalance = fromCurrencyBalance;

      const maxFromNativeCurrencyFee = AtomexSwapPreviewManager.calculateMaxTotalFee(swapPreviewFees, swapCurrencyInfos.fromNativeCurrencyInfo.currency.id);
      fromNativeCurrencyBalance = fromNativeCurrencyBalance.minus(maxFromNativeCurrencyFee);
      if (fromNativeCurrencyBalance.isLessThanOrEqualTo(0)) {
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'fees',
            currencyId: swapCurrencyInfos.fromNativeCurrencyInfo.currency.id,
            requiredAmount: maxFromNativeCurrencyFee
          }
        });
      } else if (userInvolvedSwapsInfo) {
        const swapsInfoCurrencySection = userInvolvedSwapsInfo[swapCurrencyInfos.fromNativeCurrencyInfo.currency.id];
        if (swapsInfoCurrencySection) {
          fromNativeCurrencyBalance = fromNativeCurrencyBalance.minus(swapsInfoCurrencySection.lockedAmount);
          if (fromNativeCurrencyBalance.isLessThanOrEqualTo(0)) {
            errors.push({
              id: 'not-enough-funds',
              data: {
                type: 'swaps',
                currencyId: swapsInfoCurrencySection.currencyId,
                swapIds: swapsInfoCurrencySection.swapIds,
                lockedAmount: swapsInfoCurrencySection.lockedAmount
              }
            });
          }
        }
      }

      if (swapCurrencyInfos.isFromCurrencyNative) {
        fromCurrencyBalance = fromNativeCurrencyBalance;
      } else {
        if (fromCurrencyBalance.isLessThanOrEqualTo(0)) {
          errors.push({
            id: 'not-enough-funds',
            data: {
              type: 'balance',
              currencyId: actualOrderPreview?.from.currencyId || availableLiquidity.from.currencyId,
              requiredAmount: actualOrderPreview?.from.amount || availableLiquidity.from.amount
            }
          });
        } else if (userInvolvedSwapsInfo) {
          const swapsInfoCurrencySection = userInvolvedSwapsInfo[swapCurrencyInfos.fromCurrencyInfo.currency.id];
          if (swapsInfoCurrencySection) {
            fromCurrencyBalance = fromCurrencyBalance.minus(swapsInfoCurrencySection.lockedAmount);
            if (fromCurrencyBalance.isLessThanOrEqualTo(0)) {
              errors.push({
                id: 'not-enough-funds',
                data: {
                  type: 'swaps',
                  currencyId: swapsInfoCurrencySection.currencyId,
                  swapIds: swapsInfoCurrencySection.swapIds,
                  lockedAmount: swapsInfoCurrencySection.lockedAmount
                }
              });
            }
          }
        }
      }

      maxOrderPreview = fromCurrencyBalance.isGreaterThan(0)
        ? await this.getMaxOrderPreview(fromCurrencyBalance, availableLiquidity)
        : undefined;

      if (maxOrderPreview && actualOrderPreview && actualOrderPreview.from.amount.isGreaterThan(maxOrderPreview.from.amount)) {
        if (actualOrderPreview.from.amount.isGreaterThan(initialFromCurrencyBalance))
          errors.push({
            id: 'not-enough-funds',
            data: {
              type: 'balance',
              currencyId: actualOrderPreview.from.currencyId,
              requiredAmount: actualOrderPreview.from.amount.minus(maxOrderPreview.from.amount)
            }
          });
        else if (userInvolvedSwapsInfo) {
          const swapsInfoCurrencySection = userInvolvedSwapsInfo[swapCurrencyInfos.fromCurrencyInfo.currency.id];
          if (swapsInfoCurrencySection)
            errors.push({
              id: 'not-enough-funds',
              data: {
                type: 'swaps',
                swapIds: swapsInfoCurrencySection.swapIds,
                currencyId: swapsInfoCurrencySection.currencyId,
                lockedAmount: swapsInfoCurrencySection.lockedAmount
              }
            });
        }
      }
    }

    if (authorizedToAddress) {
      let toNativeCurrencyBalance = await this.atomexContext.managers.balanceManager.getBalance(authorizedToAddress, swapCurrencyInfos.toNativeCurrencyInfo.currency);
      if (!toNativeCurrencyBalance)
        throw new Error('Can not get to currency balance');

      const maxToNativeCurrencyFee = swapPreviewFees.success.find(fee => fee.name === 'redeem-fee')?.max;
      if (maxToNativeCurrencyFee) {
        toNativeCurrencyBalance = toNativeCurrencyBalance.minus(maxToNativeCurrencyFee);
        if (toNativeCurrencyBalance.isLessThan(0)) {
          errors.push({
            id: 'not-enough-funds',
            data: {
              type: 'fees',
              currencyId: swapCurrencyInfos.toNativeCurrencyInfo.currency.id,
              requiredAmount: maxToNativeCurrencyFee
            }
          });
        } else if (userInvolvedSwapsInfo) {
          const swapsInfoCurrencySection = userInvolvedSwapsInfo[swapCurrencyInfos.fromNativeCurrencyInfo.currency.id];
          if (swapsInfoCurrencySection) {
            toNativeCurrencyBalance = toNativeCurrencyBalance.minus(swapsInfoCurrencySection.lockedAmount);
            if (toNativeCurrencyBalance.isLessThanOrEqualTo(0)) {
              errors.push({
                id: 'not-enough-funds',
                data: {
                  type: 'swaps',
                  currencyId: swapsInfoCurrencySection.currencyId,
                  swapIds: swapsInfoCurrencySection.swapIds,
                  lockedAmount: swapsInfoCurrencySection.lockedAmount
                }
              });
            }
          }
        }
      }
    }

    return {
      fromAddress,
      toAddress,
      maxOrderPreview
    };
  }

  protected async getMaxOrderPreview(
    fromCurrencyBalance: BigNumber,
    availableLiquidity: SymbolLiquidity,
  ): Promise<OrderPreview | undefined> {
    const maxAmount = BigNumber.min(fromCurrencyBalance, availableLiquidity.from.amount);
    const maxOrderPreview = await this.atomexContext.managers.exchangeManager.getOrderPreview({
      type: availableLiquidity.type,
      from: availableLiquidity.from.currencyId,
      to: availableLiquidity.to.currencyId,
      amount: maxAmount,
      isFromAmount: true,
    });

    return maxOrderPreview;
  }

  protected async getUserInvolvedSwapsInfo(
    authorizedFromAddress: string | undefined,
    authorizedToAddress: string | undefined,
    swapCurrencyInfos: SwapCurrencyInfos
  ): Promise<UserInvolvedSwapsInfo | undefined> {
    const authorizedAddresses = authorizedFromAddress && authorizedToAddress
      ? authorizedFromAddress !== authorizedToAddress
        ? [authorizedFromAddress, authorizedToAddress].sort()
        : [authorizedFromAddress]
      : authorizedFromAddress
        ? [authorizedFromAddress]
        : authorizedToAddress
          ? [authorizedToAddress]
          : undefined;
    if (!authorizedAddresses)
      return undefined;

    const cacheKey = this.getUserInvolvedSwapsCacheKey(
      authorizedAddresses,
      swapCurrencyInfos.fromCurrencyInfo.currency.id,
      swapCurrencyInfos.toCurrencyInfo.currency.id
    );
    let swapsInfo = this.userInvolvedSwapsCache.get<UserInvolvedSwapsInfo>(cacheKey);
    if (swapsInfo)
      return swapsInfo;

    const involvedSwaps = await this.getInvolvedSwaps(authorizedAddresses);
    swapsInfo = await this.getUserInvolvedSwapsInfoByActiveSwaps(involvedSwaps);
    this.userInvolvedSwapsCache.set(cacheKey, swapsInfo);

    return swapsInfo;
  }

  protected async getUserInvolvedSwapsInfoByActiveSwaps(involvedSwaps: readonly Swap[]): Promise<UserInvolvedSwapsInfo> {
    const userInvolvedSwapsInfo: MutableUserInvolvedSwapsInfo = {};

    for (const swap of involvedSwaps) {
      const swapCurrencyInfos = this.getSwapCurrencyInfos(swap.from.currencyId, swap.to.currencyId);
      const swapsInfoCurrencySection = this.getOrCreateUserInvolvedSwapsCurrencyInfo(userInvolvedSwapsInfo, swap.from.currencyId);

      swapsInfoCurrencySection.swaps.push(swap);
      swapsInfoCurrencySection.swapIds.push(swap.id);
      swapsInfoCurrencySection.lockedAmount = swapsInfoCurrencySection.lockedAmount.plus(swap.from.amount);

      // eslint-disable-next-line no-await-in-loop
      const fees = await this.calculateSwapPreviewFees(
        swapCurrencyInfos,
        { redeemEnabled: !swap.counterParty.requisites.rewardForRedeem.isZero(), refundEnabled: true }
      );
      const maxFromNativeCurrencyFee = AtomexSwapPreviewManager.calculateMaxTotalFee(fees, swapCurrencyInfos.fromNativeCurrencyInfo.currency.id);
      const maxToNativeCurrencyFee = swapCurrencyInfos.fromNativeCurrencyInfo.currency.id !== swapCurrencyInfos.toNativeCurrencyInfo.currency.id
        ? AtomexSwapPreviewManager.calculateMaxTotalFee(fees, swapCurrencyInfos.toCurrencyInfo.currency.id)
        : undefined;

      if (swapCurrencyInfos.isFromCurrencyNative) {
        swapsInfoCurrencySection.lockedAmount = swapsInfoCurrencySection.lockedAmount.plus(maxFromNativeCurrencyFee);
      } else {
        const swapsInfoCurrencySection = this.getOrCreateUserInvolvedSwapsCurrencyInfo(userInvolvedSwapsInfo, swapCurrencyInfos.fromNativeCurrencyInfo.currency.id);
        swapsInfoCurrencySection.swaps.push(swap);
        swapsInfoCurrencySection.swapIds.push(swap.id);
        swapsInfoCurrencySection.lockedAmount = swapsInfoCurrencySection.lockedAmount.plus(maxFromNativeCurrencyFee);
      }

      if (maxToNativeCurrencyFee) {
        const swapsInfoCurrencySection = this.getOrCreateUserInvolvedSwapsCurrencyInfo(userInvolvedSwapsInfo, swapCurrencyInfos.toCurrencyInfo.currency.id);
        swapsInfoCurrencySection.swaps.push(swap);
        swapsInfoCurrencySection.swapIds.push(swap.id);
        swapsInfoCurrencySection.lockedAmount = swapsInfoCurrencySection.lockedAmount.plus(maxToNativeCurrencyFee);
      }
    }

    return userInvolvedSwapsInfo;
  }

  private getOrCreateUserInvolvedSwapsCurrencyInfo<
    TSwapsInfo extends MutableUserInvolvedSwapsInfo | UserInvolvedSwapsInfo
  >(userInvolvedSwapsInfo: TSwapsInfo, currencyId: Currency['id']): TSwapsInfo[Currency['id']] {
    if (!userInvolvedSwapsInfo[currencyId])
      (userInvolvedSwapsInfo as MutableUserInvolvedSwapsInfo)[currencyId] = {
        currencyId,
        swaps: [],
        swapIds: [],
        lockedAmount: new BigNumber(0)
      };

    return userInvolvedSwapsInfo[currencyId] as TSwapsInfo[Currency['id']];
  }

  // TODO: use the server filter
  protected async getInvolvedSwaps(addresses: string[]) {
    const swaps = await this.atomexContext.managers.swapManager.getSwaps(addresses);

    const now = Date.now();
    const activeSwaps = swaps.filter(swap => {
      if (!(
        (swap.user.status === 'Created' || swap.user.status === 'Involved')
        && (swap.counterParty.status === 'Created' || swap.counterParty.status === 'Involved'
          || swap.counterParty.status === 'PartiallyInitiated' || swap.counterParty.status === 'Initiated'
        )
      )) {
        return false;
      }

      const swapTimeStamp = swap.timeStamp.getTime();
      if (!(
        (swapTimeStamp + swap.user.requisites.lockTime * 1000 > now)
        && (swap.counterParty.requisites.lockTime === 0 || (swapTimeStamp + swap.counterParty.requisites.lockTime * 1000 > now))
      )) {
        return false;
      }

      return true;
    });

    return activeSwaps;
  }

  protected async calculateSwapPreviewFees(
    swapCurrencyInfos: SwapCurrencyInfos,
    watchTowerOptions: NormalizedSwapPreviewParameters['watchTower']
  ): Promise<SwapPreview['fees']> {
    const feesCacheKey = this.getSwapPreviewFeesCacheKey(swapCurrencyInfos.fromCurrencyInfo, swapCurrencyInfos.toCurrencyInfo, watchTowerOptions);
    const cachedFees = this.swapPreviewFeesCache.get<SwapPreview['fees']>(feesCacheKey);
    if (cachedFees)
      return cachedFees;

    const fromAtomexProtocol = (swapCurrencyInfos.fromCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain);
    const toAtomexProtocol = (swapCurrencyInfos.toCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain);

    const toRedeemFees = await toAtomexProtocol.getRedeemFees({});
    const [fromInitiateFees, toRedeemOrRewardForRedeem, fromRefundFees, toInitiateFees, fromRedeemFees] = await Promise.all([
      // TODO: fill parameters
      fromAtomexProtocol.getInitiateFees({}),
      watchTowerOptions.redeemEnabled ? toAtomexProtocol.getRedeemReward(toRedeemFees) : toRedeemFees,
      watchTowerOptions.refundEnabled ? undefined : fromAtomexProtocol.getRefundFees({}),

      toAtomexProtocol.getInitiateFees({}),
      fromAtomexProtocol.getRedeemFees({}),
    ]);

    const paymentFee: SwapPreviewFee = {
      name: 'payment-fee',
      currencyId: swapCurrencyInfos.fromNativeCurrencyInfo.currency.id,
      estimated: fromInitiateFees.estimated,
      max: fromInitiateFees.max,
    };
    const makerFee = await this.calculateMakerFees(
      swapCurrencyInfos.fromCurrencyInfo.currency,
      swapCurrencyInfos.fromNativeCurrencyInfo.currency,
      swapCurrencyInfos.toNativeCurrencyInfo.currency,
      toInitiateFees,
      fromRedeemFees
    );
    const successFees: SwapPreviewFee[] = [
      paymentFee,
      makerFee,
      {
        name: watchTowerOptions.redeemEnabled ? 'redeem-reward' : 'redeem-fee',
        currencyId: watchTowerOptions.redeemEnabled ? swapCurrencyInfos.toCurrencyInfo.currency.id : swapCurrencyInfos.toNativeCurrencyInfo.currency.id,
        estimated: toRedeemOrRewardForRedeem.estimated,
        max: toRedeemOrRewardForRedeem.max
      }
    ];
    const refundFees: SwapPreviewFee[] = [paymentFee, makerFee];
    if (fromRefundFees)
      refundFees.push({
        name: 'refund-fee',
        currencyId: swapCurrencyInfos.fromNativeCurrencyInfo.currency.id,
        estimated: fromRefundFees.estimated,
        max: fromRefundFees.max
      });

    const swapPreviewFees: SwapPreview['fees'] = {
      success: successFees,
      refund: refundFees
    };
    this.swapPreviewFeesCache.set(feesCacheKey, swapPreviewFees);

    return swapPreviewFees;
  }

  protected async calculateMakerFees(
    fromCurrency: Currency,
    fromNativeCurrency: Currency,
    toNativeCurrency: Currency,
    toInitiateFees: FeesInfo,
    fromRedeemFees: FeesInfo
  ): Promise<SwapPreviewFee> {
    const [toInitiateFeeInInFromCurrency, fromRedeemFeeInFromCurrency]: readonly [FeesInfo, FeesInfo] = await Promise.all([
      fromCurrency !== toNativeCurrency
        ? this.convertFeesFromNativeCurrencyToCustom(toInitiateFees, toNativeCurrency, fromCurrency)
        : toInitiateFees,

      fromCurrency !== fromNativeCurrency
        ? this.convertFeesFromNativeCurrencyToCustom(fromRedeemFees, fromNativeCurrency, fromCurrency)
        : fromRedeemFees
    ]);

    return {
      name: 'maker-fee',
      currencyId: fromCurrency.id,
      estimated: toInitiateFeeInInFromCurrency.estimated.plus(fromRedeemFeeInFromCurrency.estimated),
      max: toInitiateFeeInInFromCurrency.max.plus(fromRedeemFeeInFromCurrency.max)
    };
  }

  protected async convertFeesFromNativeCurrencyToCustom(fees: FeesInfo, nativeCurrency: Currency, customCurrency: Currency): Promise<FeesInfo> {
    const price = await this.atomexContext.managers.priceManager.getPrice({ baseCurrency: nativeCurrency, quoteCurrency: customCurrency, provider: 'atomex' });
    if (!price)
      throw new Error(`It's no possible to convert fees from "${nativeCurrency.id}" to "${customCurrency.id}" currency`);

    const [exchangeSymbol, _] = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(
      this.atomexContext.providers.exchangeSymbolsProvider.getSymbolsMap(),
      nativeCurrency.id,
      customCurrency.id
    );
    const customCurrencyDecimals = exchangeSymbol.baseCurrency === customCurrency.id ? exchangeSymbol.decimals.baseCurrency : exchangeSymbol.decimals.quoteCurrency;
    const estimatedInCustomCurrency = converters.toFixedBigNumber(fees.estimated.multipliedBy(price), customCurrencyDecimals, BigNumber.ROUND_CEIL);
    const maxInCustomCurrency = converters.toFixedBigNumber(fees.max.multipliedBy(price), customCurrencyDecimals, BigNumber.ROUND_CEIL);

    return {
      estimated: estimatedInCustomCurrency,
      max: maxInCustomCurrency
    };
  }

  private getSwapPreviewFeesCacheKey(
    fromCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    watchTowerOptions: NormalizedSwapPreviewParameters['watchTower']
  ) {
    return `${fromCurrencyInfo.currency.id}_${toCurrencyInfo.currency.id}_${watchTowerOptions.redeemEnabled}_${watchTowerOptions.refundEnabled}`;
  }

  private getUserInvolvedSwapsCacheKey(
    addresses: string[],
    fromCurrencyId: Currency['id'],
    toCurrencyId: Currency['id']
  ) {
    const firstCurrency = fromCurrencyId < toCurrencyId ? fromCurrencyId : toCurrencyId;
    const secondCurrency = firstCurrency === fromCurrencyId ? toCurrencyId : fromCurrencyId;
    return `${addresses.join('_')}_${firstCurrency}_${secondCurrency}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNormalizedSwapPreviewParameters(swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters {
    return ordersHelper.isNormalizedOrderPreviewParameters(swapPreviewParameters);
  }

  static normalizeSwapPreviewParameters(
    swapPreviewParameters: SwapPreviewParameters,
    exchangeSymbolsProvider: ExchangeSymbolsProvider,
    defaultWatchTowerOptions: NormalizedSwapPreviewParameters['watchTower']
  ): NormalizedSwapPreviewParameters {
    const normalizedOrderPreviewParameters = ordersHelper.normalizeOrderPreviewParameters(swapPreviewParameters, exchangeSymbolsProvider);

    return {
      type: swapPreviewParameters.type,
      amount: swapPreviewParameters.amount,
      watchTower: swapPreviewParameters.watchTower === undefined || swapPreviewParameters.watchTower === null
        ? defaultWatchTowerOptions
        : {
          redeemEnabled: typeof swapPreviewParameters.watchTower.redeemEnabled === 'boolean' ? swapPreviewParameters.watchTower.redeemEnabled : defaultWatchTowerOptions.redeemEnabled,
          refundEnabled: typeof swapPreviewParameters.watchTower.refundEnabled === 'boolean' ? swapPreviewParameters.watchTower.refundEnabled : defaultWatchTowerOptions.refundEnabled,
        },
      from: normalizedOrderPreviewParameters.from,
      to: normalizedOrderPreviewParameters.to,
      isFromAmount: normalizedOrderPreviewParameters.isFromAmount,
      exchangeSymbol: normalizedOrderPreviewParameters.exchangeSymbol,
      side: normalizedOrderPreviewParameters.side,
      isBaseCurrencyAmount: normalizedOrderPreviewParameters.isBaseCurrencyAmount,
    };
  }

  protected static calculateMaxTotalFee(fees: SwapPreview['fees'], currencyId: Currency['id']) {
    const successTotalFee = this.calculateTotalFee(fees.success, currencyId);
    const refundTotalFee = this.calculateTotalFee(fees.refund, currencyId);

    return BigNumber.max(successTotalFee, refundTotalFee);
  }

  protected static calculateTotalFee(fees: readonly SwapPreviewFee[], currencyId: Currency['id']) {
    return fees.reduce(
      (total, fee) => fee.currencyId === currencyId && fee.name.endsWith('fee') ? total.plus(fee.max) : total,
      new BigNumber(0)
    );
  }
}
