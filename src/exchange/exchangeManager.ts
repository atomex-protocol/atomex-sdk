import type { BigNumber } from 'bignumber.js';

import { AtomexComponent, DataSource, ImportantDataReceivingMode, Side } from '../common/index';
import { EventEmitter, type ToEventEmitter, type Result } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider';
import { symbolsHelper } from './helpers/index';
import type {
  CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol,
  OrderPreviewParameters as OrderPreviewParameters,
  NewOrderRequest, Order, OrderBook, OrderPreview, OrdersSelector, Quote, OrderBookEntry, OrderType
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
    protected readonly symbolsProvider: ManagedExchangeSymbolsProvider
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
    await this.getSymbols();

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

  async getSymbol(name: string, dataSource = DataSource.All): Promise<ExchangeSymbol | undefined> {
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const symbol = this.symbolsProvider.getSymbol(name);
      if (symbol)
        return symbol;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const symbols = await this.exchangeService.getSymbols();
      this.symbolsProvider.setSymbols(symbols);

      return this.symbolsProvider.getSymbol(name);
    }

    return undefined;
  }

  async getSymbols(dataSource = DataSource.All): Promise<readonly ExchangeSymbol[]> {
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const symbols = this.symbolsProvider.getSymbols();
      if (symbols.length > 0)
        return symbols;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const symbols = await this.exchangeService.getSymbols();
      this.symbolsProvider.setSymbols(symbols);

      return symbols;
    }

    return [];
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
      const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
      [symbol] = symbolsHelper.findSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to);
    }

    if (!symbol)
      throw new Error('Invalid Symbol');

    const orderBook = await this.exchangeService.getOrderBook(symbol);
    if (orderBook)
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
    const amount = orderPreviewParameters.amount;

    if (orderPreviewParameters.type !== 'SolidFillOrKill')
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');

    const [symbol, side] = this.getSymbolAndSideByOrderPreviewParameters(orderPreviewParameters);
    const exchangeSymbol = this.symbolsProvider.getSymbol(symbol);
    if (!exchangeSymbol)
      throw undefined;

    const orderBookEntry = await this.findOrderBookEntry(symbol, side, orderPreviewParameters.type, amount, isFromAmount);
    if (!orderBookEntry)
      return undefined;

    const [from, to] = symbolsHelper.convertSymbolToFromToCurrenciesPair(exchangeSymbol, side, amount, orderBookEntry.price);

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
    this._orderBookCache.set(updatedOrderBook.symbol, updatedOrderBook);
    (this.events.orderBookUpdated as ToEventEmitter<typeof this.events.orderBookUpdated>).emit(updatedOrderBook);
  };

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuotes: readonly Quote[]) => {
    (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(updatedQuotes);
  };

  protected getSymbolAndSideByOrderPreviewParameters(orderPreviewParameters: OrderPreviewParameters): readonly [symbol: string, side: Side] {
    if (orderPreviewParameters.symbol && orderPreviewParameters.side)
      return [orderPreviewParameters.symbol, orderPreviewParameters.side];

    if (orderPreviewParameters.from && orderPreviewParameters.to) {
      const exchangeSymbols = this.symbolsProvider.getSymbolsMap();

      return symbolsHelper.findSymbolAndSide(exchangeSymbols, orderPreviewParameters.from, orderPreviewParameters.to);
    }

    throw new Error('Invalid orderPreviewParameters argument passed');
  }

  protected async findOrderBookEntry(symbol: string, side: Side, orderType: OrderType, amount: BigNumber, isFromAmount: boolean) {
    if (orderType !== 'SolidFillOrKill')
      return undefined;

    const orderBook = await this.getCachedOrderBook(symbol);
    if (!orderBook)
      return undefined;

    for (const entry of orderBook.entries) {
      if (entry.side == side && (isFromAmount ? amount : amount.div(entry.price)).isLessThanOrEqualTo(Math.max(...entry.qtyProfile))) {
        return entry;
      }
    }
  }

  protected getCachedOrderBook(symbol: string) {
    const cachedOrderBook = this._orderBookCache.get(symbol);

    return cachedOrderBook ? Promise.resolve(cachedOrderBook) : this.getOrderBook(symbol);
  }
}
