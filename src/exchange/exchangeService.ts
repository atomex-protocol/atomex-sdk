import type { CollectionSelector, } from '../common/index';
import type { PublicEventEmitter } from '../core/index';
import type { Order, ExchangeSymbol, NewOrderRequest, Quote, OrderBook } from './models/index';

export interface ExchangeServiceEvents {
  readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]>;
  readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
  readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
}

export interface ExchangeService {
  readonly events: ExchangeServiceEvents;

  getOrder(orderId: string): Promise<Order | undefined>;
  getOrders(selector?: CollectionSelector): Promise<Order[]>;
  getSymbols(): Promise<ExchangeSymbol[]>;
  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getOrderBook(symbol: string): Promise<OrderBook>;

  addOrder(newOrderRequest: NewOrderRequest): Promise<number>;
  cancelOrder(orderId: number): Promise<boolean>;
  cancelAllOrders(): Promise<number>;
}
