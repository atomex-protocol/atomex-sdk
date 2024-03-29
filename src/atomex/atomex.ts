import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { AtomexProtocolMultiChain, WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import { NewOrderRequest, ExchangeManager, symbolsHelper, PriceManager } from '../exchange/index';
import type { Swap, SwapManager } from '../swaps/index';
import { toFixedBigNumber } from '../utils/converters';
import type { AtomexContext } from './atomexContext';
import { AtomexSwapPreviewManager } from './atomexSwapPreviewManager';
import {
  NewSwapRequest, SwapOperationCompleteStage, AtomexOptions,
  AtomexBlockchainNetworkOptions,
  SwapPreviewParameters,
  NormalizedSwapPreviewParameters,
  SwapPreview
} from './models/index';

export class Atomex implements AtomexService {
  readonly authorization: AuthorizationManager;
  readonly exchangeManager: ExchangeManager;
  readonly balanceManager: BalanceManager;
  readonly priceManager: PriceManager;
  readonly swapManager: SwapManager;
  readonly wallets: WalletsManager;
  readonly atomexContext: AtomexContext;

  protected readonly swapPreviewManager: AtomexSwapPreviewManager;

  private _isStarted = false;

  constructor(readonly options: AtomexOptions) {
    this.atomexContext = options.atomexContext;
    this.swapPreviewManager = new AtomexSwapPreviewManager(options.atomexContext);

    this.wallets = options.managers.walletsManager;
    this.authorization = options.managers.authorizationManager;
    this.exchangeManager = options.managers.exchangeManager;
    this.swapManager = options.managers.swapManager;
    this.balanceManager = options.managers.balanceManager;
    this.priceManager = options.managers.priceManager;

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
    this.swapPreviewManager.dispose();

    this._isStarted = false;
  }

  addBlockchain(factoryMethod: (context: AtomexContext) => [blockchain: string, options: AtomexBlockchainNetworkOptions]) {
    const [blockchain, blockchainOptions] = factoryMethod(this.atomexContext);
    this.atomexContext.providers.blockchainProvider.addBlockchain(blockchain, blockchainOptions);
  }

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
  }

  getSwapPreview(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): Promise<SwapPreview> {
    return this.swapPreviewManager.getSwapPreview(swapPreviewParameters);
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage = SwapOperationCompleteStage.All): Promise<Swap | readonly Swap[]> {
    if (typeof newSwapRequestOrSwapId === 'number')
      throw new Error('Swap tracking is not implemented yet');

    const swapPreview = newSwapRequestOrSwapId.swapPreview;
    if (swapPreview.errors.length)
      throw new Error('Swap preview has errors');

    const fromAddress = swapPreview.from.address;
    if (!fromAddress)
      throw new Error('Swap preview doesn\'t have the "from" address');
    const toAddress = swapPreview.to.address;
    if (!toAddress)
      throw new Error('Swap preview doesn\'t have the "to" address');

    const [baseCurrencyId, quoteCurrencyId] = symbolsHelper.getBaseQuoteCurrenciesBySymbol(swapPreview.symbol);
    const baseCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(baseCurrencyId);
    if (!baseCurrencyInfo)
      throw new Error(`The "${baseCurrencyId}" currency (base) is unknown`);
    const quoteCurrencyInfo = this.atomexContext.providers.blockchainProvider.getCurrencyInfo(quoteCurrencyId);
    if (!quoteCurrencyInfo)
      throw new Error(`The "${quoteCurrencyId}" currency (quote) is unknown`);

    if (baseCurrencyInfo.atomexProtocol.type !== 'multi-chain')
      throw new Error(`Unknown type (${baseCurrencyInfo.atomexProtocol.type}) of the Atomex protocol (base)`);
    if (quoteCurrencyInfo.atomexProtocol.type !== 'multi-chain')
      throw new Error(`Unknown type (${quoteCurrencyInfo.atomexProtocol.type}) of the Atomex protocol (quote)`);

    const baseCurrencyAtomexProtocolMultiChain = baseCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain;
    const quoteCurrencyAtomexProtocolMultiChain = quoteCurrencyInfo.atomexProtocol as AtomexProtocolMultiChain;
    const directionName: 'from' | 'to' = baseCurrencyId === swapPreview.from.currencyId ? 'from' : 'to';
    const rewardForRedeem = swapPreview.fees.success.find(fee => fee.name == 'redeem-reward')?.estimated;
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
        receivingAddress: toAddress,
        refundAddress: newSwapRequestOrSwapId.refundAddress || null,
        rewardForRedeem: rewardForRedeem || new BigNumber(0),
        // TODO: from config
        lockTime: 18000,
        baseCurrencyContract: baseCurrencyAtomexProtocolMultiChain.swapContractAddress,
        quoteCurrencyContract: quoteCurrencyAtomexProtocolMultiChain.swapContractAddress
      }
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

    this.swapPreviewManager.clearCache();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return swaps.length === 1 ? swaps[0]! : (swaps as readonly Swap[]);
  }

  async convertCurrency(fromAmount: BigNumber.Value, fromCurrency: Currency['id'], toCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const price = await this.priceManager.getAveragePrice({ baseCurrency: fromCurrency, quoteCurrency: toCurrency });
    if (!price)
      return undefined;

    const inAmountBigNumber = BigNumber.isBigNumber(fromAmount) ? fromAmount : new BigNumber(fromAmount);
    const outAmount = inAmountBigNumber.multipliedBy(price);
    const toCurrencyInfo = this.getCurrency(toCurrency);

    return toCurrencyInfo ? toFixedBigNumber(outAmount, toCurrencyInfo.decimals) : outAmount;
  }
}
