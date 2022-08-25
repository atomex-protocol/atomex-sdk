import BigNumber from 'bignumber.js';

import type { AtomexProtocolV1, CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency } from '../common/index';
import type { Mutable } from '../core/index';
import { ExchangeSymbolsProvider, ordersHelper, type NormalizedOrderPreviewParameters, type OrderPreview } from '../exchange/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';

export class AtomexSwapPreviewManager {
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

    const availableLiquidity = await this.atomexContext.managers.exchangeManager.getAvailableLiquidity({
      type: normalizedSwapPreviewParameters.type,
      symbol: normalizedSwapPreviewParameters.exchangeSymbol.name,
      side: normalizedSwapPreviewParameters.side
    });
    if (!availableLiquidity)
      throw new Error(`No available liquidity for the "${normalizedSwapPreviewParameters.exchangeSymbol.name}" symbol`);

    const errors: Mutable<SwapPreview['errors']> = [];
    const warnings: Mutable<SwapPreview['warnings']> = [];

    const actualOrderPreview = await this.atomexContext.managers.exchangeManager.getOrderPreview(normalizedSwapPreviewParameters);
    const fees = await this.calculateSwapPreviewFees(
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
      normalizedSwapPreviewParameters.useWatchTower
    );

    const swapPreviewAccountData = await this.getSwapPreviewAccountData(
      normalizedSwapPreviewParameters,
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
      availableLiquidity.from.amount,
      fees,
      errors,
      warnings
    );

    if (!actualOrderPreview)
      errors.push({ id: 'not-enough-liquidity' });
    else if (swapPreviewAccountData.maxOrderPreview && actualOrderPreview.from.amount.isGreaterThan(swapPreviewAccountData.maxOrderPreview.from.amount))
      errors.push({ id: 'not-enough-funds' });

    return {
      type: normalizedSwapPreviewParameters.type,
      from: {
        currencyId: normalizedSwapPreviewParameters.from,
        address: swapPreviewAccountData.fromAddress,
        actual: actualOrderPreview
          ? {
            amount: actualOrderPreview.from.amount,
            price: actualOrderPreview.from.price,
          }
          : {
            amount: normalizedSwapPreviewParameters.isFromAmount ? normalizedSwapPreviewParameters.amount : new BigNumber(0),
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
        currencyId: normalizedSwapPreviewParameters.to,
        address: swapPreviewAccountData.toAddress,
        actual: actualOrderPreview
          ? {
            amount: actualOrderPreview.to.amount,
            price: actualOrderPreview.to.price,
          }
          : {
            amount: !normalizedSwapPreviewParameters.isFromAmount ? normalizedSwapPreviewParameters.amount : new BigNumber(0),
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
      symbol: normalizedSwapPreviewParameters.exchangeSymbol.name,
      side: normalizedSwapPreviewParameters.side,
      fees,
      errors,
      warnings
    };
  }

  protected normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): NormalizedSwapPreviewParameters {
    return AtomexSwapPreviewManager.isNormalizedSwapPreviewParameters(swapPreviewParameters)
      ? swapPreviewParameters
      : AtomexSwapPreviewManager.normalizeSwapPreviewParameters(swapPreviewParameters, this.atomexContext.providers.exchangeSymbolsProvider, true);
  }

  protected async getSwapPreviewAccountData(
    normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters,
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    toNativeCurrencyInfo: CurrencyInfo,
    fromAvailableAmount: BigNumber,
    swapPreviewFees: SwapPreview['fees'],
    errors: Mutable<SwapPreview['errors']>,
    warnings: Mutable<SwapPreview['warnings']>
  ): Promise<{ fromAddress?: string; toAddress?: string; maxOrderPreview?: OrderPreview }> {
    let fromAddress: string | undefined;
    let toAddress: string | undefined;
    let maxOrderPreview: OrderPreview | undefined;

    const maxFromNativeCurrencyFee = AtomexSwapPreviewManager.calculateMaxTotalFee(swapPreviewFees, fromNativeCurrencyInfo.currency.id);
    const maxToNativeCurrencyFee = AtomexSwapPreviewManager.calculateMaxTotalFee(swapPreviewFees, toNativeCurrencyInfo.currency.id);

    const [fromWallet, toWallet] = await Promise.all([
      this.atomexContext.managers.walletsManager.getWallet(undefined, fromCurrencyInfo.currency.blockchain),
      this.atomexContext.managers.walletsManager.getWallet(undefined, toCurrencyInfo.currency.blockchain),
    ]);

    if (fromWallet) {
      fromAddress = await fromWallet.getAddress();
      const [fromCurrencyBalance, fromNativeCurrencyBalance] = await Promise.all([
        this.atomexContext.managers.balanceManager.getBalance(fromAddress, fromCurrencyInfo.currency),
        this.atomexContext.managers.balanceManager.getBalance(fromAddress, fromNativeCurrencyInfo.currency)
      ]);

      if (!fromCurrencyBalance || !fromNativeCurrencyBalance)
        throw new Error('Can not get from currency balances');

      if (fromNativeCurrencyBalance.isLessThan(maxFromNativeCurrencyFee)) {
        errors.push({
          id: 'not-enough-funds-network-fee',
          data: { requiredAmount: maxFromNativeCurrencyFee }
        });
      }

      maxOrderPreview = await this.getMaxOrderPreview(
        normalizedSwapPreviewParameters,
        fromAvailableAmount,
        fromCurrencyBalance,
        fromCurrencyInfo,
        fromNativeCurrencyBalance,
        fromNativeCurrencyInfo,
        maxFromNativeCurrencyFee,
        errors,
        warnings
      );
    }

    if (toWallet) {
      toAddress = await toWallet.getAddress();
      const toNativeCurrencyBalance = await this.atomexContext.managers.balanceManager.getBalance(toAddress, toNativeCurrencyInfo.currency);
      if (!toNativeCurrencyBalance)
        throw new Error('Can not get to currency balance');

      if (toNativeCurrencyBalance.isLessThan(maxToNativeCurrencyFee))
        errors.push({
          id: 'not-enough-funds-network-fee',
          data: { requiredAmount: maxToNativeCurrencyFee }
        });
    }

    return {
      fromAddress,
      toAddress,
      maxOrderPreview
    };
  }

  protected async getMaxOrderPreview(
    normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters,
    fromAvailableAmount: BigNumber,
    fromCurrencyBalance: BigNumber,
    fromCurrencyInfo: CurrencyInfo,
    _fromNativeCurrencyBalance: BigNumber,
    fromNativeCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyNetworkFee: BigNumber,
    errors: Mutable<SwapPreview['errors']>,
    _warnings: Mutable<SwapPreview['warnings']>
  ): Promise<OrderPreview | undefined> {
    // TODO: add sum of the in progress swaps
    const maxAmount = BigNumber.min(
      fromCurrencyInfo.currency.id === fromNativeCurrencyInfo.currency.id
        ? fromCurrencyBalance.minus(fromNativeCurrencyNetworkFee)
        : fromCurrencyBalance,
      fromAvailableAmount
    );

    if (maxAmount.isLessThanOrEqualTo(0)) {
      errors.push({ id: 'not-enough-funds' });
      return undefined;
    }

    return this.atomexContext.managers.exchangeManager.getOrderPreview({
      type: normalizedSwapPreviewParameters.type,
      from: normalizedSwapPreviewParameters.from,
      to: normalizedSwapPreviewParameters.to,
      amount: maxAmount,
      isFromAmount: true,
    });
  }

  protected async calculateSwapPreviewFees(
    fromCurrencyInfo: CurrencyInfo,
    fromNativeCurrencyInfo: CurrencyInfo,
    toCurrencyInfo: CurrencyInfo,
    toNativeCurrencyInfo: CurrencyInfo,
    useWatchTower: boolean
  ): Promise<SwapPreview['fees']> {
    const fromAtomexProtocol = (fromCurrencyInfo.atomexProtocol as AtomexProtocolV1);
    const toAtomexProtocol = (toCurrencyInfo.atomexProtocol as AtomexProtocolV1);
    const [fromInitiateFees, toRedeemOrRewardForRedeem, fromRefundFees, toInitiateFees, fromRedeemFees] = await Promise.all([
      // TODO: fill parameters
      fromAtomexProtocol.getInitiateFees({}),
      useWatchTower ? toAtomexProtocol.getRedeemReward(0, 0) : toAtomexProtocol.getRedeemFees({}),
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
      fromCurrencyInfo.currency.id,
      fromNativeCurrencyInfo.currency.id,
      toNativeCurrencyInfo.currency.id,
      toInitiateFees,
      fromRedeemFees
    );

    return {
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
  }

  protected async calculateMakerFees(
    fromCurrencyId: Currency['id'],
    fromNativeCurrencyId: Currency['id'],
    toNativeCurrencyId: Currency['id'],
    toInitiateFees: FeesInfo,
    fromRedeemFees: FeesInfo
  ): Promise<SwapPreviewFee> {
    const toInitiateFeeConversationPromise = this.convertFeesToFromCurrency(toInitiateFees, toNativeCurrencyId, fromCurrencyId);
    const fromRedeemFeeConversationPromise = fromCurrencyId !== fromNativeCurrencyId
      ? this.convertFeesToFromCurrency(fromRedeemFees, fromNativeCurrencyId, fromCurrencyId)
      : undefined;

    let estimatedToInitiateFeesInFromCurrency: BigNumber;
    let maxToInitiateFeesInFromCurrency: BigNumber;
    let estimatedFromRedeemFeesInFromCurrency: BigNumber;
    let maxFromRedeemFeesInFromCurrency: BigNumber;
    if (fromRedeemFeeConversationPromise) {
      const conversationResult = await Promise.all([toInitiateFeeConversationPromise, fromRedeemFeeConversationPromise]);
      estimatedToInitiateFeesInFromCurrency = conversationResult[0].estimated;
      maxToInitiateFeesInFromCurrency = conversationResult[0].max;
      estimatedFromRedeemFeesInFromCurrency = conversationResult[1].estimated;
      maxFromRedeemFeesInFromCurrency = conversationResult[1].max;
    }
    else {
      const conversationResult = await toInitiateFeeConversationPromise;
      estimatedToInitiateFeesInFromCurrency = conversationResult.estimated;
      maxToInitiateFeesInFromCurrency = conversationResult.max;
      estimatedFromRedeemFeesInFromCurrency = fromRedeemFees.estimated;
      maxFromRedeemFeesInFromCurrency = fromRedeemFees.max;
    }

    return {
      name: 'maker-fee',
      currencyId: fromCurrencyId,
      estimated: estimatedToInitiateFeesInFromCurrency.plus(estimatedFromRedeemFeesInFromCurrency),
      max: maxToInitiateFeesInFromCurrency.plus(maxFromRedeemFeesInFromCurrency)
    };
  }

  protected async convertFeesToFromCurrency(fees: FeesInfo, from: Currency['id'], to: Currency['id']): Promise<FeesInfo> {
    const [estimatedInFromCurrency, maxInFromCurrency] = await Promise.all([
      this.atomexContext.managers.exchangeManager.getOrderPreview({
        type: 'SolidFillOrKill',
        from,
        to,
        amount: fees.estimated,
        isFromAmount: true
      }).then(orderPreview => orderPreview?.to.amount),

      this.atomexContext.managers.exchangeManager.getOrderPreview({
        type: 'SolidFillOrKill',
        from,
        to,
        amount: fees.max,
        isFromAmount: true
      }).then(orderPreview => orderPreview?.to.amount)
    ]);

    if (!estimatedInFromCurrency || !maxInFromCurrency)
      throw new Error(`It's no possible to convert fees from "${from}" to "${to}" currency`);

    return {
      estimated: estimatedInFromCurrency,
      max: maxInFromCurrency
    };
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
      isQuoteCurrencyAmount: normalizedOrderPreviewParameters.isQuoteCurrencyAmount,
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
