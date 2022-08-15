import type { OrderBook } from '../models';
import type { ManagedOrderBookProvider } from './orderBookProvider';

export class InMemoryOrderBookProvider implements ManagedOrderBookProvider {
  private readonly orderBookMap: Map<OrderBook['symbol'], OrderBook> = new Map();

  getOrderBook(symbol: string): OrderBook | undefined {
    return this.orderBookMap.get(symbol);
  }

  setOrderBook(symbol: string, orderBook: OrderBook): void {
    this.orderBookMap.set(symbol, orderBook);
  }
}
