import type { BigNumber } from 'bignumber.js';

import { AtomexComponent, ImportantDataReceivingMode, Side } from '../common/index';
import { EventEmitter, type ToEventEmitter, type Result } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ExchangeSymbolsProvider } from './exchangeSymbolsProvider';
import { symbolsHelper } from './helpers/index';
import type {
  CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol,
  OrderPreviewParameters as OrderPreviewParameters,
  NewOrderRequest, Order, OrderBook, OrderPreview, OrdersSelector, Quote
} from './models/index';

export class ExchangeManager implements AtomexComponent {
  readonly events: ExchangeServiceEvents = {
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  private _isStarted = false;
  private _orderBookCache: Map<OrderBook['symbol'], OrderBook> = new Map();

  constructor(
    protected readonly exchangeService: ExchangeService,
    protected readonly symbolsProvider: ExchangeSymbolsProvider
  ) {
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    this.attachEvents();
    await this.exchangeService.start();

    this._isStarted = true;
  }

  stop() {
    if (!this._isStarted)
      return;

    this.detachEvents();
    this.exchangeService.stop();

    this._isStarted = false;
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

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook | undefined> {
    let symbol: string;

    if (typeof symbolOrDirection === 'string')
      symbol = symbolOrDirection;
    else {
      const exchangeSymbols = this.symbolsProvider.getSymbols();
      [symbol] = symbolsHelper.findSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to);
    }

    if (!symbol.trim())
      throw new Error('Invalid Symbol');

    const orderBook = this.exchangeService.getOrderBook(symbol);
    if (!orderBook)
      this._orderBookCache.set(symbol, orderBook);

    return orderBook;
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

  async getOrderPreview(orderPreviewParameters: OrderPreviewParameters): Promise<OrderPreview | undefined> {
    const isFromAmount = orderPreviewParameters.isFromAmount || true;
    // TODO: validate amount
    const amount = orderPreviewParameters.amount;

    if (orderPreviewParameters.type !== 'SolidFillOrKill')
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');

    let symbol: string | undefined = undefined;
    let side: Side | undefined = undefined;
    if (orderPreviewParameters.symbol && orderPreviewParameters.side) {
      symbol = orderPreviewParameters.symbol;
      side = orderPreviewParameters.side;
    }
    else if (orderPreviewParameters.from && orderPreviewParameters.to) {
      const exchangeSymbols = this.symbolsProvider.getSymbols();
      [symbol, side] = symbolsHelper.findSymbolAndSide(exchangeSymbols, orderPreviewParameters.from, orderPreviewParameters.to);
    }
    else
      throw new Error('Invalid orderPreviewParameters argument passed');

    const orderBook = await this.getCachedOrderBook(symbol);
    if (!orderBook)
      return undefined;

    const entry = orderBook.entries
      .filter(entry => entry.side == side)
      .find(entry => (isFromAmount ? amount : amount.div(entry.price)).isLessThanOrEqualTo(Math.max(...entry.qtyProfile)));
    if (!entry)
      return undefined;

    const exchangeSymbol = this.symbolsProvider.getSymbol(symbol);
    if (!exchangeSymbol)
      throw new Error(`"${exchangeSymbol}" symbol not found`);

    const [from, to] = symbolsHelper.convertSymbolToFromToCurrenciesPair(exchangeSymbol, side, amount, entry.price);

    return {
      type: orderPreviewParameters.type,
      from,
      to,
      side,
      symbol,
    };
  }

  getMaximumLiquidity(_direction: CurrencyDirection): Promise<BigNumber> {
    throw new Error('Not implemented');
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

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuotes: readonly Quote[]) => {
    (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(updatedQuotes);
  };

  protected getCachedOrderBook(symbol: string) {
    const cachedOrderBook = this._orderBookCache.get(symbol);

    return cachedOrderBook ? Promise.resolve(cachedOrderBook) : this.getOrderBook(symbol);
  }
}
