import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest,
  SwapsSelector, CurrencyDirection
} from '../exchange/index';
import type { Swap } from '../swaps/index';
import { atomexUtils } from '../utils';
import type { AtomexClient } from './atomexClient';

export class MixedApiAtomexClient implements AtomexClient {
  readonly events: AtomexClient['events'];

  private _isStarted = false;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly restAtomexClient: AtomexClient,
    protected readonly webSocketAtomexClient: AtomexClient
  ) {
    atomexUtils.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils.ensureNetworksAreSame(this, webSocketAtomexClient);

    this.events = {
      swapUpdated: this.webSocketAtomexClient.events.swapUpdated,
      orderBookSnapshot: this.webSocketAtomexClient.events.orderBookSnapshot,
      orderBookUpdated: this.webSocketAtomexClient.events.orderBookUpdated,
      orderUpdated: this.webSocketAtomexClient.events.orderUpdated,
      topOfBookUpdated: this.webSocketAtomexClient.events.topOfBookUpdated
    };
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    await Promise.all([
      this.webSocketAtomexClient.start(),
      this.restAtomexClient.start()
    ]);

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this.webSocketAtomexClient.stop();
    this.restAtomexClient.stop();

    this._isStarted = false;
  }

  getOrder(accountAddress: string, orderId: number): Promise<Order | undefined> {
    return this.restAtomexClient.getOrder(accountAddress, orderId);
  }

  getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]> {
    return this.restAtomexClient.getOrders(accountAddress, selector);
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    return this.restAtomexClient.getSymbols();
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    return (this.restAtomexClient.getTopOfBook as (symbolsOrDirections?: string[] | CurrencyDirection[]) => Promise<Quote[]>)(symbolsOrDirections);
  }

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook | undefined> {
    return (this.restAtomexClient.getOrderBook as (symbolOrDirection: string | CurrencyDirection) => Promise<OrderBook | undefined>)(symbolOrDirection);
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    return this.restAtomexClient.addOrder(accountAddress, newOrderRequest);
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    return this.restAtomexClient.cancelOrder(accountAddress, cancelOrderRequest);
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    return this.restAtomexClient.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    return this.restAtomexClient.getSwapTransactions(swap);
  }

  getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
  getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
  getSwap(swapId: number, addressOrAddresses: string | string[]): Promise<Swap | undefined> {
    return (this.restAtomexClient.getSwap as (swapId: number, addressOrAddresses: string | string[]) => Promise<Swap | undefined>)(swapId, addressOrAddresses);
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
  getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
  getSwaps(addressOrAddresses: string | string[], selector?: SwapsSelector): Promise<Swap[]> {
    return (this.restAtomexClient.getSwaps as (addressOrAddresses: string | string[], selector?: SwapsSelector) => Promise<Swap[]>)(addressOrAddresses, selector);
  }
}
