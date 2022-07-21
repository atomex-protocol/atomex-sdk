import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents, OrdersSelector } from '../exchange/index';
import type { Swap } from '../swaps/index';
import { atomexUtils } from '../utils';
import type { AtomexClient } from './atomexClient';

export class MixedApiAtomexClient implements AtomexClient {
  readonly events: ExchangeServiceEvents;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly restAtomexClient: AtomexClient,
    protected readonly webSocketAtomexClient: AtomexClient
  ) {
    atomexUtils.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils.ensureNetworksAreSame(this, webSocketAtomexClient);

    this.events = {
      orderBookUpdated: this.webSocketAtomexClient.events.orderBookUpdated,
      orderUpdated: this.webSocketAtomexClient.events.orderUpdated,
      topOfBookUpdated: this.webSocketAtomexClient.events.topOfBookUpdated
    };
  }

  getOrder(orderId: number): Promise<Order | undefined> {
    return this.restAtomexClient.getOrder(orderId);
  }

  getOrders(selector?: OrdersSelector | undefined): Promise<Order[]> {
    return this.restAtomexClient.getOrders(selector);
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    return this.restAtomexClient.getSymbols();
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]> {
    return this.restAtomexClient.getTopOfBook(symbols);
  }

  getOrderBook(symbol: string): Promise<OrderBook> {
    return this.restAtomexClient.getOrderBook(symbol);
  }

  addOrder(newOrderRequest: NewOrderRequest): Promise<number> {
    return this.restAtomexClient.addOrder(newOrderRequest);
  }

  cancelOrder(orderId: number): Promise<boolean> {
    return this.restAtomexClient.cancelOrder(orderId);
  }

  cancelAllOrders(): Promise<number> {
    return this.restAtomexClient.cancelAllOrders();
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    return this.restAtomexClient.getSwapTransactions(swap);
  }

  getSwap(swapId: string): Promise<Swap> {
    return this.restAtomexClient.getSwap(swapId);
  }
}
