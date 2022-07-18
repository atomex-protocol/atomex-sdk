import type { BigNumber } from 'bignumber.js';

import { ImportantDataReceivingMode, type CollectionSelector } from '../common/index';
import { EventEmitter, type ToEventEmitter, type Result } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ExchangeSymbol, NewOrderRequest, Order, OrderBook, Quote } from './models/index';

export class ExchangeManager {
  readonly events: ExchangeServiceEvents = {
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  constructor(
    protected readonly exchangeService: ExchangeService
  ) {
    this.attachEvents();
  }

  getOrder(orderId: string, mode = ImportantDataReceivingMode.SafeMerged): Promise<Result<Order | undefined>> {
    throw new Error('Not implemented');
  }

  getOrders(selector?: CollectionSelector, mode = ImportantDataReceivingMode.SafeMerged): Promise<Result<Order[]>> {
    throw new Error('Not implemented');
  }

  getSymbols(): Promise<ExchangeSymbol> {
    throw new Error('Not implemented');
  }

  getTopOfBook(): Promise<Quote[]> {
    throw new Error('Not implemented');
  }

  getOrderBook(): Promise<OrderBook> {
    throw new Error('Not implemented');
  }

  getRewardForRedeem(nativeTokenUsdPrice: number, nativeTokenCurrencyPrice: number): Promise<Result<BigNumber>> {
    throw new Error('Not implemented');
  }

  addOrder(newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Not implemented');
  }

  cancelOrder(orderId: number): Promise<boolean> {
    throw new Error('Not implemented');
  }

  cancelAllOrders(): Promise<number> {
    throw new Error('Not implemented');
  }

  protected attachEvents() {
    this.exchangeService.events.orderUpdated.addListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookUpdated.addListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.addListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected detachEvents() {
    this.exchangeService.events.orderUpdated.removeListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookUpdated.removeListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.removeListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected handleExchangeServiceOrderUpdated = (updatedOrder: Order) => {
    (this.events.orderUpdated as ToEventEmitter<typeof this.events.orderUpdated>).emit(updatedOrder);
  };

  protected handleExchangeServiceOrderBookUpdated = (updatedOrderBook: OrderBook) => {
    (this.events.orderBookUpdated as ToEventEmitter<typeof this.events.orderBookUpdated>).emit(updatedOrderBook);
  };

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuotes: readonly Quote[]) => {
    (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(updatedQuotes);
  };
}
