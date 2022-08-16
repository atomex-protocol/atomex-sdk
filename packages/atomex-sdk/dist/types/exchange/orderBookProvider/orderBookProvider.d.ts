import type { OrderBook } from '../models';
export interface OrderBookProvider {
    getOrderBook(symbol: string): OrderBook | undefined;
}
export interface ManagedOrderBookProvider extends OrderBookProvider {
    setOrderBook(symbol: string, orderBook: OrderBook): void;
}
