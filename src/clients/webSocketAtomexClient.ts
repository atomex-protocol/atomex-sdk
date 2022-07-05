import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import { EventEmitter, type PublicEventEmitter, type ToEventEmitter } from '../core';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';

export class WebSocketAtomexClient implements AtomexClient {
  readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]> = new EventEmitter();
  readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]> = new EventEmitter();
  readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]> = new EventEmitter();

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly authorizationManager: AuthorizationManager
  ) {
  }

  getOrder(orderId: string): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(selector?: CollectionSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol> {
    throw new Error('Method not implemented.');
  }

  getTopOfBook(): Promise<Quote[]> {
    throw new Error('Method not implemented.');
  }

  getOrderBook(): Promise<OrderBook> {
    throw new Error('Method not implemented.');
  }

  addOrder(newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(orderId: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getSwap(swapId: string): Promise<Swap> {
    throw new Error('Not implemented');
  }
}