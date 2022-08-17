import type { BigNumber } from 'bignumber.js';
import { nanoid } from 'nanoid';

import { AtomexService, DataSource, ImportantDataReceivingMode, Side } from '../common/index';
import { EventEmitter, type ToEventEmitter } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider/index';
import { symbolsHelper } from './helpers/index';
import type {
  CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol,
  OrderPreviewParameters as OrderPreviewParameters,
  NewOrderRequest, Order, OrderBook, OrderPreview, OrdersSelector, Quote, OrderType, PreparedPreviewParameters, FilledNewOrderRequest
} from './models/index';
import type { ManagedOrderBookProvider } from './orderBookProvider';

export interface ExchangeManagerOptions {
  exchangeService: ExchangeService;
  symbolsProvider: ManagedExchangeSymbolsProvider;
  orderBookProvider: ManagedOrderBookProvider;
}

export class ExchangeManager implements AtomexService {
  readonly events: ExchangeServiceEvents = {
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly exchangeService: ExchangeService;
  protected readonly symbolsProvider: ManagedExchangeSymbolsProvider;
  protected readonly orderBookProvider: ManagedOrderBookProvider;

  private _isStarted = false;

  constructor(options: ExchangeManagerOptions) {
    this.exchangeService = options.exchangeService;
    this.symbolsProvider = options.symbolsProvider;
    this.orderBookProvider = options.orderBookProvider;
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
      symbol = symbolsHelper.findExchangeSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to)[0].name;
    }

    if (!symbol)
      throw new Error('Invalid Symbol');

    const orderBook = await this.exchangeService.getOrderBook(symbol);
    if (orderBook)
      this.orderBookProvider.setOrderBook(symbol, orderBook);

    return orderBook;
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    const filledNewOrderRequest: FilledNewOrderRequest = {
      clientOrderId: newOrderRequest.clientOrderId || nanoid(17),
      orderBody: newOrderRequest.orderBody,
      requisites: newOrderRequest.requisites,
      proofsOfFunds: newOrderRequest.proofsOfFunds ? newOrderRequest.proofsOfFunds : [
        // TODO
      ]
    };

    return this.exchangeService.addOrder(accountAddress, filledNewOrderRequest);
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    return this.exchangeService.cancelOrder(accountAddress, cancelOrderRequest);
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    return this.exchangeService.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }

  async getOrderPreview(orderPreviewParameters: OrderPreviewParameters): Promise<OrderPreview | undefined> {
    if (orderPreviewParameters.type !== 'SolidFillOrKill')
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');

    const preparedOrderPreviewParameters = this.getPreparedOrderPreviewParameters(orderPreviewParameters);
    const orderBookEntry = await this.findOrderBookEntry(
      preparedOrderPreviewParameters.exchangeSymbol.name,
      preparedOrderPreviewParameters.side, orderPreviewParameters.type,
      preparedOrderPreviewParameters.amount,
      preparedOrderPreviewParameters.isQuoteCurrencyAmount
    );
    if (!orderBookEntry)
      return undefined;

    const [from, to] = symbolsHelper.convertSymbolToFromToCurrenciesPair(
      preparedOrderPreviewParameters.exchangeSymbol,
      preparedOrderPreviewParameters.side,
      preparedOrderPreviewParameters.amount,
      orderBookEntry.price,
      preparedOrderPreviewParameters.isQuoteCurrencyAmount
    );

    return {
      type: orderPreviewParameters.type,
      from,
      to,
      side: preparedOrderPreviewParameters.side,
      symbol: preparedOrderPreviewParameters.exchangeSymbol.name,
    };
  }

  getMaximumLiquidity(_direction: CurrencyDirection): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  protected attachEvents() {
    this.exchangeService.events.orderUpdated.addListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookSnapshot.addListener(this.handleExchangeServiceOrderBookSnapshot);
    this.exchangeService.events.orderBookUpdated.addListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.addListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected detachEvents() {
    this.exchangeService.events.orderUpdated.removeListener(this.handleExchangeServiceOrderUpdated);
    this.exchangeService.events.orderBookSnapshot.removeListener(this.handleExchangeServiceOrderBookSnapshot);
    this.exchangeService.events.orderBookUpdated.removeListener(this.handleExchangeServiceOrderBookUpdated);
    this.exchangeService.events.topOfBookUpdated.removeListener(this.handleExchangeServiceTopOfBookUpdated);
  }

  protected handleExchangeServiceOrderUpdated = (updatedOrder: Order) => {
    (this.events.orderUpdated as ToEventEmitter<typeof this.events.orderUpdated>).emit(updatedOrder);
  };

  protected handleExchangeServiceOrderBookSnapshot = async (orderBook: OrderBook) => {
    (this.events.orderBookSnapshot as ToEventEmitter<typeof this.events.orderBookSnapshot>).emit(orderBook);
  };

  protected handleExchangeServiceOrderBookUpdated = async (updatedOrderBook: OrderBook) => {
    (this.events.orderBookUpdated as ToEventEmitter<typeof this.events.orderBookUpdated>).emit(updatedOrderBook);
  };

  protected handleExchangeServiceTopOfBookUpdated = (updatedQuotes: readonly Quote[]) => {
    (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(updatedQuotes);
  };

  protected getPreparedOrderPreviewParameters(orderPreviewParameters: OrderPreviewParameters): PreparedPreviewParameters {
    const exchangeSymbols = this.symbolsProvider.getSymbolsMap();

    let symbol: string;
    let exchangeSymbol: PreparedPreviewParameters['exchangeSymbol'] | undefined;
    let side: PreparedPreviewParameters['side'];
    let isQuoteCurrencyAmount: PreparedPreviewParameters['isQuoteCurrencyAmount'] = true;

    if (orderPreviewParameters.symbol && orderPreviewParameters.side) {
      symbol = orderPreviewParameters.symbol;
      exchangeSymbol = exchangeSymbols.get(symbol);
      side = orderPreviewParameters.side;
      if (orderPreviewParameters.isQuoteCurrencyAmount !== undefined && orderPreviewParameters.isQuoteCurrencyAmount !== null)
        isQuoteCurrencyAmount = orderPreviewParameters.isQuoteCurrencyAmount;
    }
    else if (orderPreviewParameters.from && orderPreviewParameters.to) {
      [exchangeSymbol, side] = symbolsHelper.findExchangeSymbolAndSide(exchangeSymbols, orderPreviewParameters.from, orderPreviewParameters.to);
      symbol = exchangeSymbol.name;
      const isFromAmount = (orderPreviewParameters.isFromAmount !== undefined && orderPreviewParameters.isFromAmount !== null)
        ? orderPreviewParameters.isFromAmount
        : true;
      if (exchangeSymbol)
        isQuoteCurrencyAmount = (orderPreviewParameters.from === exchangeSymbol.quoteCurrency && isFromAmount)
          || (orderPreviewParameters.to === exchangeSymbol.quoteCurrency && !isFromAmount);
    }
    else
      throw new Error('Invalid orderPreviewParameters argument passed');

    if (!exchangeSymbol)
      throw new Error(`The ${symbol} Symbol not found`);

    return {
      type: orderPreviewParameters.type,
      amount: orderPreviewParameters.amount,
      exchangeSymbol,
      side,
      isQuoteCurrencyAmount
    };
  }

  protected async findOrderBookEntry(symbol: string, side: Side, orderType: OrderType, amount: BigNumber, isQuoteCurrencyAmount: boolean) {
    if (orderType !== 'SolidFillOrKill')
      return undefined;

    const orderBook = await this.getCachedOrderBook(symbol);
    if (!orderBook)
      return undefined;

    for (const entry of orderBook.entries) {
      if (entry.side !== side && (isQuoteCurrencyAmount ? amount : amount.div(entry.price)).isLessThanOrEqualTo(Math.max(...entry.qtyProfile))) {
        return entry;
      }
    }
  }

  protected getCachedOrderBook(symbol: string): Promise<OrderBook | undefined> {
    const cachedOrderBook = this.orderBookProvider.getOrderBook(symbol);

    return cachedOrderBook ? Promise.resolve(cachedOrderBook) : this.getOrderBook(symbol);
  }
}
