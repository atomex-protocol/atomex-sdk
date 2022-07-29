import type { BigNumber } from 'bignumber.js';

import { ImportantDataReceivingMode } from '../common/index';
import { EventEmitter, type ToEventEmitter, type Result } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol, NewOrderRequest, Order, OrderBook, OrdersSelector, Quote } from './models/index';

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

  getOrder(accountAddress: string, orderId: number, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Order | undefined> {
    return this.exchangeService.getOrder(accountAddress, orderId);
  }

  getOrders(accountAddress: string, selector?: OrdersSelector | undefined, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Order[]> {
    return this.exchangeService.getOrders(accountAddress, selector);
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    return this.exchangeService.getSymbols();
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    return (this.exchangeService.getTopOfBook as (symbolsOrDirections?: string[] | CurrencyDirection[]) => Promise<Quote[]>)(symbolsOrDirections);
  }

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    return (this.exchangeService.getOrderBook as (symbolOrDirection: string | CurrencyDirection) => Promise<OrderBook>)(symbolOrDirection);
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    return this.exchangeService.addOrder(accountAddress, newOrderRequest);
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    return this.exchangeService.cancelOrder(accountAddress, cancelOrderRequest);
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    return this.exchangeService.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }

  getRewardForRedeem(_nativeTokenUsdPrice: number, _nativeTokenCurrencyPrice: number): Promise<Result<BigNumber>> {
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

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuote: Quote) => {
    (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(updatedQuote);
  };
}
