import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { AtomexProtocolV1, CurrencyInfo, WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import { NewOrderRequest, ExchangeManager, symbolsHelper, OrderPreview } from '../exchange/index';
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

    const actualOrderPreview = await this.exchangeManager.getOrderPreview(normalizedSwapPreviewParameters);
    if (!actualOrderPreview)
      throw new Error(`It's no possible to calculate the order preview for the "${normalizedSwapPreviewParameters.exchangeSymbol.name}" symbol`);

    const fees = await this.calculateSwapPreviewFees(
      fromCurrencyInfo,
      fromNativeCurrencyInfo,
      toCurrencyInfo,
      toNativeCurrencyInfo,
      normalizedSwapPreviewParameters.useWatchTower
    );

    let maxOrderPreview: OrderPreview | undefined;
    let fromAddress: string | undefined;
    let toAddress: string | undefined;
    const fromWallet = await this.atomexContext.managers.walletsManager.getWallet(undefined, fromCurrencyInfo.currency.blockchain);
    if (fromWallet) {
      fromAddress = await fromWallet.getAddress();

      const [fromCurrencyBalance, fromNativeCurrencyBalance] = await Promise.all([
        fromCurrencyInfo.balanceProvider.getBalance(fromAddress),
        fromNativeCurrencyInfo.balanceProvider.getBalance(fromAddress)
      ]);

      const successTotalFee = fees.success.reduce(
        (total, fee) => {
          return (fee.name === 'payment-fee' || fee.name === 'redeem-fee')
            ? total.plus(fee.max)
            : total;
        }, new BigNumber(0)
      );
      const refundTotalFee = fees.refund.reduce(
        (total, fee) => {
          return (fee.name === 'payment-fee' || fee.name === 'refund-fee')
            ? total.plus(fee.max)
            : total;
        }, new BigNumber(0)
      );
      // TODO: add sum of the in progress swaps
      const maxAmount = fromCurrencyInfo.currency.id === fromNativeCurrencyInfo.currency.id
        ? BigNumber.max(fromCurrencyBalance.minus(BigNumber.max(successTotalFee, refundTotalFee)), 0)
        : fromCurrencyBalance;

      maxOrderPreview = await this.exchangeManager.getOrderPreview({
        type: normalizedSwapPreviewParameters.type,
        from: normalizedSwapPreviewParameters.from,
        to: normalizedSwapPreviewParameters.to,
        amount: maxAmount,
        isFromAmount: true,
      });
    }

    return {
      type: normalizedSwapPreviewParameters.type,
      from: {
        currencyId: normalizedSwapPreviewParameters.from,
        address: fromAddress,
        actual: {
          amount: actualOrderPreview.from.amount,
          price: actualOrderPreview.from.price,
        },
        available: {
          amount: availableLiquidity.from.amount,
          price: availableLiquidity.from.price
        },
        max: maxOrderPreview && {
          amount: maxOrderPreview.from.amount,
          price: maxOrderPreview.from.price
        }
      },
      to: {
        currencyId: normalizedSwapPreviewParameters.to,
        address: toAddress,
        actual: {
          amount: actualOrderPreview.to.amount,
          price: actualOrderPreview.to.price,
        },
        available: {
          amount: availableLiquidity.to.amount,
          price: availableLiquidity.to.price
        },
        max: maxOrderPreview && {
          amount: maxOrderPreview.to.amount,
          price: maxOrderPreview.to.price
        }
      },
      symbol: normalizedSwapPreviewParameters.exchangeSymbol.name,
      side: normalizedSwapPreviewParameters.side,
      fees,
      errors: [],
      warnings: []
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

    const quoteCurrencyId = symbolsHelper.getQuoteBaseCurrenciesBySymbol(swapPreview.symbol)[0];
    const directionName: 'from' | 'to' = quoteCurrencyId === swapPreview.from.currencyId ? 'from' : 'to';

    const [baseCurrency, quoteCurrency] = symbolsHelper.getQuoteBaseCurrenciesBySymbol(swapPreview.symbol);
    // const baseCurrencyContract = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(baseCurrency)
    // ?.atomexProtocol?.contract;
    // const quoteCurrencyContract = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(baseCurrency)
    // ?.atomexProtocol?.contract;
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
        baseCurrencyContract: '',
        quoteCurrencyContract: ''
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
    // TODO: use mixed rates providers
    const [estimatedMakerFee, maxMakerFee] = await Promise.all([
      this.exchangeManager.getOrderPreview({
        type: 'SolidFillOrKill',
        from: toNativeCurrencyInfo.currency.id,
        to: fromCurrencyInfo.currency.id,
        amount: toInitiateFees.estimated,
        isFromAmount: true
      }).then(orderPreview => orderPreview?.to.amount.plus(fromRedeemFees.estimated)),
      this.exchangeManager.getOrderPreview({
        type: 'SolidFillOrKill',
        from: toNativeCurrencyInfo.currency.id,
        to: fromCurrencyInfo.currency.id,
        amount: toInitiateFees.max,
        isFromAmount: true
      }).then(orderPreview => orderPreview?.to.amount.plus(fromRedeemFees.max))
    ]);
    if (!estimatedMakerFee || !maxMakerFee)
      throw new Error('It\'s no possible to calculate maker fee');

    const paymentFee: SwapPreviewFee = {
      name: 'payment-fee',
      currencyId: fromNativeCurrencyInfo.currency.id,
      estimated: fromInitiateFees.estimated,
      max: fromInitiateFees.max,
    };
    const makerFee: SwapPreviewFee = {
      name: 'maker-fee',
      currencyId: fromNativeCurrencyInfo.currency.id,
      estimated: estimatedMakerFee,
      max: maxMakerFee
    };

    return {
      success: [
        paymentFee,
        makerFee,
        {
          name: useWatchTower ? 'redeem-reward' : 'redeem-fee',
          currencyId: toCurrencyInfo.currency.id,
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
}
