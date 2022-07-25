import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { EventEmitter } from '../core';
import type {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  ExchangeServiceEvents, OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection
} from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';

export class WebSocketAtomexClient implements AtomexClient {
  readonly events: ExchangeServiceEvents = {
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly authorizationManager: AuthorizationManager
  ) {
  }

  getOrder(accountAddress: string, orderId: number): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    throw new Error('Method not implemented.');
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    throw new Error('Method not implemented.');
  }

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    throw new Error('Method not implemented.');
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getSwap(accountAddress: string, swapId: number): Promise<Swap> {
    throw new Error('Method not implemented.');
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]> {
    throw new Error('Method not implemented.');
  }
}
