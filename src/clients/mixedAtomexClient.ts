import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest } from '../exchange/index';
import type { Swap } from '../swaps/index';
import { atomexUtils } from '../utils';
import type { AtomexClient } from './atomexClient';

export class MixedApiAtomexClient implements AtomexClient {
  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly restAtomexClient: AtomexClient,
    readonly webSocketAtomexClient: AtomexClient
  ) {
    atomexUtils.ensureNetworksAreSame(this, restAtomexClient);
    atomexUtils.ensureNetworksAreSame(this, webSocketAtomexClient);
  }

  get orderUpdated() {
    return this.webSocketAtomexClient.orderUpdated;
  }

  get orderBookUpdated() {
    return this.webSocketAtomexClient.orderBookUpdated;
  }

  get topOfBookUpdated() {
    return this.webSocketAtomexClient.topOfBookUpdated;
  }

  getOrder(orderId: string): Promise<Order | undefined> {
    return this.restAtomexClient.getOrder(orderId);
  }

  getOrders(selector?: CollectionSelector | undefined): Promise<Order[]> {
    return this.restAtomexClient.getOrders(selector);
  }

  getSymbols(): Promise<ExchangeSymbol> {
    return this.restAtomexClient.getSymbols();
  }

  getTopOfBook(): Promise<Quote[]> {
    return this.restAtomexClient.getTopOfBook();
  }

  getOrderBook(): Promise<OrderBook> {
    return this.restAtomexClient.getOrderBook();
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
