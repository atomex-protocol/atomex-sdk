import type { OrderBook } from '../models';
import type { ManagedOrderBookProvider } from './orderBookProvider';
export declare class InMemoryOrderBookProvider implements ManagedOrderBookProvider {
    private readonly orderBookMap;
    getOrderBook(symbol: string): OrderBook | undefined;
    setOrderBook(symbol: string, orderBook: OrderBook): void;
}
