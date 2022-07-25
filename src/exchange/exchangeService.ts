import type { PublicEventEmitter } from '../core/index';
import type { Order, ExchangeSymbol, NewOrderRequest, Quote, OrderBook, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest } from './models/index';

export interface ExchangeServiceEvents {
  readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]>;
  readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
  readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
}

export interface ExchangeService {
  readonly events: ExchangeServiceEvents;

  getOrder(accountAddress: string, orderId: number): Promise<Order | undefined>;
  getOrders(accountAddress: string, selector?: OrdersSelector): Promise<Order[]>;
  getSymbols(): Promise<ExchangeSymbol[]>;
  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getOrderBook(symbol: string): Promise<OrderBook>;

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
}
