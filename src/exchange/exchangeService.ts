import type { PublicEventEmitter } from '../core/index';
import type { Order, ExchangeSymbol, NewOrderRequest, Quote, OrderBook, OrdersSelector, CancelOrderRequest } from './models/index';

export interface ExchangeServiceEvents {
  readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]>;
  readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
  readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
}

export interface ExchangeService {
  readonly events: ExchangeServiceEvents;

  getOrder(orderId: number): Promise<Order | undefined>;
  getOrders(selector?: OrdersSelector): Promise<Order[]>;
  getSymbols(): Promise<ExchangeSymbol[]>;
  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getOrderBook(symbol: string): Promise<OrderBook>;

  addOrder(newOrderRequest: NewOrderRequest): Promise<number>;
  cancelOrder(cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
  cancelAllOrders(): Promise<number>;
}
