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

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly restAtomexClient: AtomexClient,
    protected readonly webSocketAtomexClient: AtomexClient
  ) {
    atomexUtils.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils.ensureNetworksAreSame(this, webSocketAtomexClient);

    this.events = {
      swapUpdated: this.webSocketAtomexClient.events.swapUpdated,
      orderBookUpdated: this.webSocketAtomexClient.events.orderBookUpdated,
      orderUpdated: this.webSocketAtomexClient.events.orderUpdated,
      topOfBookUpdated: this.webSocketAtomexClient.events.topOfBookUpdated
    };
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

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    return (this.restAtomexClient.getOrderBook as (symbolOrDirection: string | CurrencyDirection) => Promise<OrderBook>)(symbolOrDirection);
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

  getSwap(accountAddresses: string[], swapId: number): Promise<Swap> {
    return this.restAtomexClient.getSwap(accountAddresses, swapId);
  }

  getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]> {
    return this.restAtomexClient.getSwaps(accountAddresses, selector);
  }
}
