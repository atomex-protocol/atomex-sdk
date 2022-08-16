import type { AtomexService } from '../common/atomexService';
import type { PublicEventEmitter } from '../core/index';
import type { Order, ExchangeSymbol, NewOrderRequest, Quote, OrderBook, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, CurrencyDirection } from './models/index';

export interface ExchangeServiceEvents {
  readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]>;
  readonly orderBookSnapshot: PublicEventEmitter<readonly [orderBook: OrderBook]>;
  readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
  readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
}

export interface ExchangeService extends AtomexService {
  readonly events: ExchangeServiceEvents;

  getOrder(accountAddress: string, orderId: number): Promise<Order | undefined>;
  getOrders(accountAddress: string, selector?: OrdersSelector): Promise<Order[]>;

  getSymbols(): Promise<ExchangeSymbol[]>;

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
}
