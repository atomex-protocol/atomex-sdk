import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import { toFixedBigNumber } from '../utils/converters';
import type { AtomexContext } from './atomexContext';
import {
  SwapOperationCompleteStage, AtomexOptions,
  NewSwapRequest, AtomexBlockchainNetworkOptions
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

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage = SwapOperationCompleteStage.All): Promise<Swap | readonly Swap[]> {
    if (typeof newSwapRequestOrSwapId === 'number')
      throw new Error('Swap tracking is not implemented yet');

    const orderId = await this.exchangeManager.addOrder(newSwapRequestOrSwapId.accountAddress, newSwapRequestOrSwapId);
    const order = await this.exchangeManager.getOrder(newSwapRequestOrSwapId.accountAddress, orderId);
    if (!order)
      throw new Error(`The ${orderId} order not found`);

    if (order.status !== 'Filled')
      throw new Error(`The ${orderId} order is not filled`);

    const swaps = await Promise.all(order.swapIds.map(swapId => this.swapManager.getSwap(swapId, newSwapRequestOrSwapId.accountAddress)));
    if (!swaps.length)
      throw new Error('Swaps not found');
    if (swaps.some(swap => !swap))
      throw new Error('Swap not found');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return swaps.length === 1 ? swaps[0]! : (swaps as readonly Swap[]);
  }

  async convertCurrency(fromAmount: BigNumber.Value, fromCurrency: Currency['id'], toCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const price = await this.atomexContext.managers.priceManager.getAveragePrice({ baseCurrency: fromCurrency, quoteCurrency: toCurrency });
    if (!price)
      return undefined;

    const inAmountBigNumber = BigNumber.isBigNumber(fromAmount) ? fromAmount : new BigNumber(fromAmount);
    const outAmount = inAmountBigNumber.multipliedBy(price);
    const toCurrencyInfo = this.getCurrency(toCurrency);

    return toCurrencyInfo ? toFixedBigNumber(outAmount, toCurrencyInfo.decimals) : outAmount;
  }
}
