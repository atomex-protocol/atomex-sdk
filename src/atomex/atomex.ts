import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import { NewOrderRequest, ExchangeManager, symbolsHelper } from '../exchange/index';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import {
  NewSwapRequest, SwapOperationCompleteStage, AtomexOptions,
  AtomexBlockchainNetworkOptions, SwapPreview, SwapPreviewParameters
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

  async getSwapPreview(_swapPreviewParameters: SwapPreviewParameters): Promise<SwapPreview> {
    throw new Error('Not implemented');
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage = SwapOperationCompleteStage.All): Promise<Swap | readonly Swap[]> {
    if (typeof newSwapRequestOrSwapId === 'number')
      throw new Error('Swap tracking is not implemented yet');

    const swapPreview = newSwapRequestOrSwapId.swapPreview;
    if (!swapPreview.errors.length)
      throw new Error('Swap preview has errors');

    const fromAddress = swapPreview.to.address;
    if (!fromAddress)
      throw new Error('Swap preview has not the "from" address');


    const quoteCurrencyId = symbolsHelper.getQuoteBaseCurrenciesBySymbol(swapPreview.symbol)[0];
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
}
