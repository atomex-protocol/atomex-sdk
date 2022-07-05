import type { BigNumber } from 'bignumber.js';

import { ImportantDataReceivingMode, type CollectionSelector } from '../common/index';
import { EventEmitter, type ToEventEmitter, type Result } from '../core/index';
import type { ExchangeService } from './exchangeService';
import type { ExchangeSymbol, NewOrderRequest, Order, OrderBook, Quote } from './models/index';

export class ExchangeManager {
  readonly orderUpdated: ExchangeService['orderUpdated'] = new EventEmitter();
  readonly orderBookUpdated: ExchangeService['orderBookUpdated'] = new EventEmitter();
  readonly topOfBookUpdated: ExchangeService['topOfBookUpdated'] = new EventEmitter();

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
    this.exchangeService.orderUpdated.addListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.orderBookUpdated.addListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.topOfBookUpdated.addListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected detachEvents() {
    this.exchangeService.orderUpdated.removeListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.orderBookUpdated.removeListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.topOfBookUpdated.removeListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected handleExchangeServiceOrderBookUpdated = (updatedOrderBook: OrderBook) => {
    (this.orderBookUpdated as ToEventEmitter<typeof this.orderBookUpdated>).emit(updatedOrderBook);
  };

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuotes: readonly Quote[]) => {
    (this.topOfBookUpdated as ToEventEmitter<typeof this.topOfBookUpdated>).emit(updatedQuotes);
  };

  protected handleExchangeServiceOrderUpdated = (updatedOrder: Order) => {
    (this.orderUpdated as ToEventEmitter<typeof this.orderUpdated>).emit(updatedOrder);
  };
}
