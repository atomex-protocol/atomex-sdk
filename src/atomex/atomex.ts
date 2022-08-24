import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { AtomexProtocolV1, CurrencyInfo, FeesInfo, WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import type { Mutable } from '../core';
import { NewOrderRequest, ExchangeManager, symbolsHelper, OrderPreview, NormalizedOrderPreviewParameters } from '../exchange/index';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import { isNormalizedSwapPreviewParameters, normalizeSwapPreviewParameters } from './helpers';
import {
  NewSwapRequest, SwapOperationCompleteStage, AtomexOptions,
  AtomexBlockchainNetworkOptions, SwapPreview, SwapPreviewParameters, NormalizedSwapPreviewParameters, SwapPreviewFee
} from './models/index';

export class Atomex implements AtomexService {
  readonly authorization: AuthorizationManager;
  readonly exchangeManager: ExchangeManager;
  readonly balanceManager: BalanceManager;
  readonly swapManager: SwapManager;
  readonly wallets: WalletsManager;
  readonly atomexContext: AtomexContext;

  private _isStarted = false;

  constructor(readonly options: AtomexOptions) {
    this.atomexContext = options.atomexContext;
    this.wallets = options.managers.walletsManager;
    this.authorization = options.managers.authorizationManager;
    this.exchangeManager = options.managers.exchangeManager;
    this.swapManager = options.managers.swapManager;
    this.balanceManager = options.managers.balanceManager;

    if (options.blockchains)
      for (const blockchainName of Object.keys(options.blockchains))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.addBlockchain(_context => [blockchainName, options.blockchains![blockchainName]!]);
  }

  get atomexNetwork() {
    return this.atomexContext.atomexNetwork;
  }

  get isStarted() {
    return this._isStarted;
  }

  async start(): Promise<void> {
    if (this.isStarted)
      return;

    await this.authorization.start();
    await this.exchangeManager.start();
    await this.swapManager.start();

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this.authorization.stop();
    this.exchangeManager.stop();
    this.swapManager.stop();
    this.balanceManager.dispose();

    this._isStarted = false;
  }

  addBlockchain(factoryMethod: (context: AtomexContext) => [blockchain: string, options: AtomexBlockchainNetworkOptions]) {
    const [blockchain, blockchainOptions] = factoryMethod(this.atomexContext);
    this.atomexContext.providers.blockchainProvider.addBlockchain(blockchain, blockchainOptions);
  }

  getCurrency(currencyId: Currency['id']) {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
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

    const availableLiquidity = await this.exchangeManager.getAvailableLiquidity({
      type: normalizedSwapPreviewParameters.type,
      symbol: normalizedSwapPreviewParameters.exchangeSymbol.name,
      side: normalizedSwapPreviewParameters.side
    });
    if (!availableLiquidity)
      throw new Error(`No available liquidity for the "${normalizedSwapPreviewParameters.exchangeSymbol.name}" symbol`);

    const errors: Mutable<SwapPreview['errors']> = [];
    const warnings: Mutable<SwapPreview['warnings']> = [];

    const actualOrderPreview = await this.exchangeManager.getOrderPreview(normalizedSwapPreviewParameters);
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

  async swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage = SwapOperationCompleteStage.All): Promise<Swap | readonly Swap[]> {
    if (typeof newSwapRequestOrSwapId === 'number')
      throw new Error('Swap tracking is not implemented yet');

    const swapPreview = newSwapRequestOrSwapId.swapPreview;
    if (swapPreview.errors.length)
      throw new Error('Swap preview has errors');

    const fromAddress = swapPreview.to.address;
    if (!fromAddress)
      throw new Error('Swap preview doesn\'t have the "from" address');

    const [baseCurrencyId, quoteCurrencyId] = symbolsHelper.getQuoteBaseCurrenciesBySymbol(swapPreview.symbol);
    const baseCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(baseCurrencyId);
    if (!baseCurrencyInfo)
      throw new Error(`The "${baseCurrencyId}" currency (base) is unknown`);
    const quoteCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(quoteCurrencyId);
    if (!quoteCurrencyInfo)
      throw new Error(`The "${quoteCurrencyInfo}" currency (quote) is unknown`);

    if (baseCurrencyInfo.atomexProtocol.version !== 1)
      throw new Error(`Unknown version (${baseCurrencyInfo.atomexProtocol.version}) of the Atomex protocol (base)`);
    if (quoteCurrencyInfo.atomexProtocol.version !== 1)
      throw new Error(`Unknown version (${quoteCurrencyInfo.atomexProtocol.version}) of the Atomex protocol (quote)`);

    const baseCurrencyAtomexProtocolV1 = baseCurrencyInfo.atomexProtocol as AtomexProtocolV1;
    const quoteCurrencyAtomexProtocolV1 = quoteCurrencyInfo.atomexProtocol as AtomexProtocolV1;
    const directionName: 'from' | 'to' = quoteCurrencyId === swapPreview.from.currencyId ? 'from' : 'to';
    const rewardForRedeem = swapPreview.fees.success.find(fee => fee.name == 'rewardForRedeem')?.estimated;
    const newOrderRequest: NewOrderRequest = {
      orderBody: {
        type: swapPreview.type,
        symbol: swapPreview.symbol,
        side: swapPreview.side,
        amount: swapPreview[directionName].actual.amount,
        price: swapPreview[directionName].actual.price
      },
      requisites: {
        secretHash: null,
        receivingAddress: swapPreview.to.address,
        refundAddress: newSwapRequestOrSwapId.refundAddress || null,
        rewardForRedeem: rewardForRedeem || new BigNumber(0),
        // TODO: from config
        lockTime: 18000,
        baseCurrencyContract: baseCurrencyAtomexProtocolV1.swapContractAddress,
        quoteCurrencyContract: quoteCurrencyAtomexProtocolV1.swapContractAddress
      },
      proofsOfFunds: [
        // TODO
      ]
    };

    const orderId = await this.exchangeManager.addOrder(fromAddress, newOrderRequest);
    const order = await this.exchangeManager.getOrder(fromAddress, orderId);
    if (!order)
      throw new Error(`The ${orderId} order not found`);

    if (order.status !== 'Filled')
      throw new Error(`The ${orderId} order is not filled`);

    const swaps = await Promise.all(order.swapIds.map(swapId => this.swapManager.getSwap(swapId, fromAddress)));
    if (!swaps.length)
      throw new Error('Swaps not found');
    if (swaps.some(swap => !swap))
      throw new Error('Swap not found');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return swaps.length === 1 ? swaps[0]! : (swaps as readonly Swap[]);
  }

  protected normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): NormalizedSwapPreviewParameters {
    return isNormalizedSwapPreviewParameters(swapPreviewParameters)
      ? swapPreviewParameters
      : normalizeSwapPreviewParameters(swapPreviewParameters, this.atomexContext.providers.exchangeSymbolsProvider, true);
  }

  private async getSwapPreviewAccountData(
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

    const maxFromNativeCurrencyFee = Atomex.calculateMaxTotalFee(swapPreviewFees, fromNativeCurrencyInfo.currency.id);
    const maxToNativeCurrencyFee = Atomex.calculateMaxTotalFee(swapPreviewFees, toNativeCurrencyInfo.currency.id);

    const [fromWallet, toWallet] = await Promise.all([
      this.atomexContext.managers.walletsManager.getWallet(undefined, fromCurrencyInfo.currency.blockchain),
      this.atomexContext.managers.walletsManager.getWallet(undefined, toCurrencyInfo.currency.blockchain),
    ]);

    if (fromWallet) {
      fromAddress = await fromWallet.getAddress();
      const [fromCurrencyBalance, fromNativeCurrencyBalance] = await Promise.all([
        this.balanceManager.getBalance(fromAddress, fromCurrencyInfo.currency),
        this.balanceManager.getBalance(fromAddress, fromNativeCurrencyInfo.currency)
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
      const toNativeCurrencyBalance = await this.balanceManager.getBalance(toAddress, toNativeCurrencyInfo.currency);
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

  private async getMaxOrderPreview(
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

    return this.exchangeManager.getOrderPreview({
      type: normalizedSwapPreviewParameters.type,
      from: normalizedSwapPreviewParameters.from,
      to: normalizedSwapPreviewParameters.to,
      amount: maxAmount,
      isFromAmount: true,
    });
  }

  private async calculateSwapPreviewFees(
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

  private async calculateMakerFees(
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

  private async convertFeesToFromCurrency(fees: FeesInfo, from: Currency['id'], to: Currency['id']): Promise<FeesInfo> {
    const [estimatedInFromCurrency, maxInFromCurrency] = await Promise.all([
      this.exchangeManager.getOrderPreview({
        type: 'SolidFillOrKill',
        from,
        to,
        amount: fees.estimated,
        isFromAmount: true
      }).then(orderPreview => orderPreview?.to.amount),

      this.exchangeManager.getOrderPreview({
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

  private static calculateMaxTotalFee(fees: SwapPreview['fees'], currencyId: Currency['id']) {
    const successTotalFee = this.calculateTotalFee(fees.success, currencyId);
    const refundTotalFee = this.calculateTotalFee(fees.refund, currencyId);

    return BigNumber.max(successTotalFee, refundTotalFee);
  }

  private static calculateTotalFee(fees: readonly SwapPreviewFee[], currencyId: Currency['id']) {
    return fees.reduce(
      (total, fee) => fee.currencyId === currencyId && fee.name.endsWith('fee') ? total.plus(fee.max) : total,
      new BigNumber(0)
    );
  }
}
