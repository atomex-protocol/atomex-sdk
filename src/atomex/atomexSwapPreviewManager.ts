import BigNumber from 'bignumber.js';

import type { AtomexProtocolMultiChain, CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency, Disposable } from '../common/index';
import { Mutable, Cache, InMemoryCache } from '../core/index';
import { ExchangeSymbolsProvider, ordersHelper, SymbolLiquidity, symbolsHelper, type OrderPreview } from '../exchange/index';
import type { Swap } from '../swaps/index';
import { converters } from '../utils/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';

interface UserInvolvedSwapsInfo {
  readonly swaps: readonly Swap[];
  readonly swapIds: ReadonlyArray<Swap['id']>;
  readonly fromCurrencyId: string;
  readonly fromTotalAmount: BigNumber;
}

export class AtomexSwapPreviewManager implements Disposable {
  private readonly swapPreviewFeesCache: Cache = new InMemoryCache({ absoluteExpirationMs: 20 * 1000 });
  private readonly userInvolvedSwapsCache: Cache = new InMemoryCache({ slidingExpirationMs: 30 * 1000 });

  constructor(protected readonly atomexContext: AtomexContext) {
  }

  async getSwapPreview(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): Promise<SwapPreview> {
    const normalizedSwapPreviewParameters = this.normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters);
    const fromCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(normalizedSwapPreviewParameters.from);
    if (!fromCurrencyInfo)
      throw new Error(`The "${normalizedSwapPreviewParameters.from}" currency (from) is unknown`);
    const toCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(normalizedSwapPreviewParameters.to);
    if (!toCurrencyInfo)
      throw new Error(`The "${normalizedSwapPreviewParameters.to}" currency (to) is unknown`);
    const fromNativeCurrencyInfo = this.atomexContext.providers.blockchainProvider.getNativeCurrencyInfo(fromCurrencyInfo.currency.blockchain);
    if (!fromNativeCurrencyInfo)
      throw new Error(`The "${fromCurrencyInfo.currency.id}" currency is a currency of unknown blockchain: ${fromCurrencyInfo.currency.blockchain}`);
    const toNativeCurrencyInfo = this.atomexContext.providers.blockchainProvider.getNativeCurrencyInfo(toCurrencyInfo.currency.blockchain);
    if (!toNativeCurrencyInfo)
      throw new Error(`The "${toCurrencyInfo.currency.id}" currency is a currency of unknown blockchain: ${toCurrencyInfo.currency.blockchain}`);

    return this.getSwapPreviewInternal(
      normalizedSwapPreviewParameters,
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo
    );
  }

  protected async getSwapPreviewInternal(
    swapPreviewParameters: NormalizedSwapPreviewParameters,
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    toNativeCurrencyInfo: CurrencyInfo
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

    const fees = await this.calculateSwapPreviewFees(
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
      swapPreviewParameters.useWatchTower
    );

    const swapPreviewAccountData = await this.getSwapPreviewAccountData(
      swapPreviewParameters,
      actualOrderPreview,
      availableLiquidity,
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
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
      : AtomexSwapPreviewManager.normalizeSwapPreviewParameters(swapPreviewParameters, this.atomexContext.providers.exchangeSymbolsProvider, true);
  }

  protected async getSwapPreviewAccountData(
    _swapPreviewParameters: NormalizedSwapPreviewParameters,
    actualOrderPreview: OrderPreview | undefined,
    availableLiquidity: SymbolLiquidity,
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    toNativeCurrencyInfo: CurrencyInfo,
    swapPreviewFees: SwapPreview['fees'],
    errors: Mutable<SwapPreview['errors']>,
    warnings: Mutable<SwapPreview['warnings']>
  ): Promise<{ fromAddress?: string; toAddress?: string; maxOrderPreview?: OrderPreview }> {
    const [fromAddress, toAddress] = await Promise.all([
      this.atomexContext.managers.walletsManager.getWallet(undefined, fromCurrencyInfo.currency.blockchain)
        .then(wallet => wallet?.getAddress())
        .then(address => address && this.atomexContext.managers.authorizationManager.getAuthToken(address) ? address : undefined),

      this.atomexContext.managers.walletsManager.getWallet(undefined, toCurrencyInfo.currency.blockchain)
        .then(wallet => wallet?.getAddress()),
    ]);
    let maxOrderPreview: OrderPreview | undefined;

    if (fromAddress) {
      const [fromCurrencyBalance, fromNativeCurrencyBalance] = await Promise.all([
        this.atomexContext.managers.balanceManager.getBalance(fromAddress, fromCurrencyInfo.currency),
        this.atomexContext.managers.balanceManager.getBalance(fromAddress, fromNativeCurrencyInfo.currency)
      ]);
      if (!fromCurrencyBalance || !fromNativeCurrencyBalance)
        throw new Error('Can not get from currency balances');

      const maxFromNativeCurrencyFee = AtomexSwapPreviewManager.calculateMaxTotalFee(swapPreviewFees, fromNativeCurrencyInfo.currency.id);
      if (fromNativeCurrencyBalance.isLessThan(maxFromNativeCurrencyFee)) {
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'fees',
            currencyId: fromNativeCurrencyInfo.currency.id,
            requiredAmount: maxFromNativeCurrencyFee
          }
        });
      }

      const fromMinAvailableAmount = BigNumber.min(
        fromCurrencyInfo.currency.id === fromNativeCurrencyInfo.currency.id
          ? fromCurrencyBalance.minus(maxFromNativeCurrencyFee)
          : fromCurrencyBalance,
        availableLiquidity.from.amount
      );

      maxOrderPreview = await this.getMaxOrderPreview(
        actualOrderPreview,
        availableLiquidity,
        fromAddress,
        fromMinAvailableAmount,
        fromCurrencyInfo,
        fromNativeCurrencyInfo,
        errors,
        warnings
      );
    }

    if (toAddress) {
      const toNativeCurrencyBalance = await this.atomexContext.managers.balanceManager.getBalance(toAddress, toNativeCurrencyInfo.currency);
      if (!toNativeCurrencyBalance)
        throw new Error('Can not get to currency balance');

      const maxToNativeCurrencyFee = swapPreviewFees.success.find(fee => fee.name === 'redeem-fee')?.max;
      if (maxToNativeCurrencyFee && toNativeCurrencyBalance.isLessThan(maxToNativeCurrencyFee))
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'fees',
            currencyId: toNativeCurrencyInfo.currency.id,
            requiredAmount: maxToNativeCurrencyFee
          }
        });
    }

    return {
      fromAddress,
      toAddress,
      maxOrderPreview
    };
  }

  protected async getMaxOrderPreview(
    actualOrderPreview: OrderPreview | undefined,
    availableLiquidity: SymbolLiquidity,
    authorizedFromAddress: string,
    fromMinAvailableAmount: BigNumber,
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    errors: Mutable<SwapPreview['errors']>,
    _warnings: Mutable<SwapPreview['warnings']>
  ): Promise<OrderPreview | undefined> {
    if (fromMinAvailableAmount.isLessThanOrEqualTo(0)) {
      if (fromCurrencyInfo.currency.id !== fromNativeCurrencyInfo.currency.id) {
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'balance',
            currencyId: actualOrderPreview?.from.currencyId || availableLiquidity.from.currencyId,
            requiredAmount: actualOrderPreview?.from.amount || availableLiquidity.from.amount
          }
        });
      }

      return undefined;
    }

    const userInvolvedSwapsInfo = await this.getUserInvolvedSwapsInfo(authorizedFromAddress, fromCurrencyInfo.currency.id);
    const maxAmount = fromMinAvailableAmount.minus(userInvolvedSwapsInfo.fromTotalAmount);
    if (maxAmount.isLessThanOrEqualTo(0)) {
      errors.push({
        id: 'not-enough-funds',
        data: {
          type: 'swaps',
          swapIds: userInvolvedSwapsInfo.swapIds,
          currencyId: userInvolvedSwapsInfo.fromCurrencyId,
          lockedAmount: userInvolvedSwapsInfo.fromTotalAmount
        }
      });
      return undefined;
    }

    const maxOrderPreview = await this.atomexContext.managers.exchangeManager.getOrderPreview({
      type: availableLiquidity.type,
      from: availableLiquidity.from.currencyId,
      to: availableLiquidity.to.currencyId,
      amount: maxAmount,
      isFromAmount: true,
    });
    if (maxOrderPreview && actualOrderPreview && actualOrderPreview.from.amount.isGreaterThan(maxOrderPreview.from.amount)) {
      if (actualOrderPreview.from.amount.isGreaterThan(fromMinAvailableAmount))
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'balance',
            currencyId: actualOrderPreview.from.currencyId,
            requiredAmount: actualOrderPreview.from.amount.minus(maxOrderPreview.from.amount)
          }
        });
      else
        errors.push({
          id: 'not-enough-funds',
          data: {
            type: 'swaps',
            swapIds: userInvolvedSwapsInfo.swapIds,
            currencyId: userInvolvedSwapsInfo.fromCurrencyId,
            lockedAmount: userInvolvedSwapsInfo.fromTotalAmount
          }
        });
    }

    return maxOrderPreview;
  }

  protected async getUserInvolvedSwapsInfo(userAddress: string, fromCurrencyId: Currency['id']): Promise<UserInvolvedSwapsInfo> {
    const cacheKey = this.getUserInvolvedSwapsCacheKey(userAddress, fromCurrencyId);
    let swapsInfo = this.userInvolvedSwapsCache.get<UserInvolvedSwapsInfo>(cacheKey);
    if (swapsInfo)
      return swapsInfo;

    const swapIds: Array<Swap['id']> = [];
    const swaps = (await this.atomexContext.managers.swapManager.getSwaps(userAddress))
      .filter(swap => {
        if (!(
          swap.from.currencyId === fromCurrencyId
          && (swap.user.status === 'Created' || swap.user.status === 'Involved')
          && (swap.counterParty.status === 'Created' || swap.counterParty.status === 'Involved'
            || swap.counterParty.status === 'PartiallyInitiated' || swap.counterParty.status === 'Initiated'
          )
        )) {
          return false;
        }

        const now = Date.now();
        const swapTimeStamp = swap.timeStamp.getTime();

        if (!(
          (swapTimeStamp + swap.user.requisites.lockTime * 1000 > now)
          && (swapTimeStamp + swap.counterParty.requisites.lockTime * 1000 > now)
        )) {
          return false;
        }

        swapIds.push(swap.id);
        return true;
      });
    const fromTotalAmount = swaps.reduce(
      (total, swap) => total.plus(swap.from.amount),
      new BigNumber(0)
    );

    swapsInfo = { swaps, swapIds, fromCurrencyId, fromTotalAmount };
    this.userInvolvedSwapsCache.set(cacheKey, swapsInfo);

    return swapsInfo;
  }

  protected async calculateSwapPreviewFees(
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    toNativeCurrencyInfo: CurrencyInfo,
    useWatchTower: boolean
  ): Promise<SwapPreview['fees']> {
    const feesCacheKey = this.getSwapPreviewFeesCacheKey(fromCurrencyInfo, toCurrencyInfo, useWatchTower);
    const cachedFees = this.swapPreviewFeesCache.get<SwapPreview['fees']>(feesCacheKey);
    if (cachedFees)
      return cachedFees;

    const fromAtomexProtocol = (fromCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain);
    const toAtomexProtocol = (toCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain);

    const toRedeemFees = await toAtomexProtocol.getRedeemFees({});
    const [fromInitiateFees, toRedeemOrRewardForRedeem, fromRefundFees, toInitiateFees, fromRedeemFees] = await Promise.all([
      // TODO: fill parameters
      fromAtomexProtocol.getInitiateFees({}),
      useWatchTower ? toAtomexProtocol.getRedeemReward(toRedeemFees) : toRedeemFees,
      fromAtomexProtocol.getRefundFees({}),

      toAtomexProtocol.getInitiateFees({}),
      fromAtomexProtocol.getRedeemFees({}),
    ]);

    const paymentFee: SwapPreviewFee = {
      name: 'payment-fee',
      currencyId: fromNativeCurrencyInfo.currency.id,
      estimated: fromInitiateFees.estimated,
      max: fromInitiateFees.max,
    };
    const makerFee = await this.calculateMakerFees(
      fromCurrencyInfo.currency,
      fromNativeCurrencyInfo.currency,
      toNativeCurrencyInfo.currency,
      toInitiateFees,
      fromRedeemFees
    );

    const swapPreviewFees: SwapPreview['fees'] = {
      success: [
        paymentFee,
        makerFee,
        {
          name: useWatchTower ? 'redeem-reward' : 'redeem-fee',
          currencyId: useWatchTower ? toCurrencyInfo.currency.id : toNativeCurrencyInfo.currency.id,
          estimated: toRedeemOrRewardForRedeem.estimated,
          max: toRedeemOrRewardForRedeem.max
        }
      ],
      refund: [
        paymentFee,
        makerFee,
        {
          name: 'refund-fee',
          currencyId: fromNativeCurrencyInfo.currency.id,
          estimated: fromRefundFees.estimated,
          max: fromRefundFees.max
        }
      ]
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
    useWatchTower: boolean
  ) {
    return `${fromCurrencyInfo.currency.id}_${toCurrencyInfo.currency.id}_${useWatchTower}`;
  }

  private getUserInvolvedSwapsCacheKey(
    userAddress: string,
    fromCurrencyId: Currency['id']
  ) {
    return `${userAddress}_${fromCurrencyId}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNormalizedSwapPreviewParameters(swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters {
    return ordersHelper.isNormalizedOrderPreviewParameters(swapPreviewParameters);
  }

  static normalizeSwapPreviewParameters(
    swapPreviewParameters: SwapPreviewParameters,
    exchangeSymbolsProvider: ExchangeSymbolsProvider,
    defaultUseWatchTowerParameter: boolean
  ): NormalizedSwapPreviewParameters {
    const normalizedOrderPreviewParameters = ordersHelper.normalizeOrderPreviewParameters(swapPreviewParameters, exchangeSymbolsProvider);

    return {
      type: swapPreviewParameters.type,
      amount: swapPreviewParameters.amount,
      useWatchTower: typeof swapPreviewParameters.useWatchTower !== 'boolean' ? defaultUseWatchTowerParameter : swapPreviewParameters.useWatchTower,
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
