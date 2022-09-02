import { BigNumber } from 'bignumber.js';
import { nanoid } from 'nanoid';

import type { AuthorizationManager } from '../authorization';
import { AtomexService, Currency, DataSource, ImportantDataReceivingMode, Side } from '../common/index';
import { EventEmitter, Cache, InMemoryCache, type ToEventEmitter } from '../core/index';
import { toFixedBigNumber } from '../utils/converters';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider/index';
import { ordersHelper, symbolsHelper } from './helpers/index';
import type {
  CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol,
  OrderPreviewParameters as OrderPreviewParameters,
  NewOrderRequest, Order, OrderBook, OrderPreview, OrdersSelector, Quote, OrderType,
  NormalizedOrderPreviewParameters, FilledNewOrderRequest, SymbolLiquidity, SymbolLiquidityParameters, ProofOfFunds
} from './models/index';
import type { ManagedOrderBookProvider } from './orderBookProvider';

export interface ExchangeManagerOptions {
  authorizationManager: AuthorizationManager;
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

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly exchangeService: ExchangeService;
  protected readonly symbolsProvider: ManagedExchangeSymbolsProvider;
  protected readonly orderBookProvider: ManagedOrderBookProvider;

  private _isStarted = false;
  private topOfBookCache: Cache = new InMemoryCache({ absoluteExpirationMs: 1000 * 60 });

  constructor(options: ExchangeManagerOptions) {
    this.authorizationManager = options.authorizationManager;
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

  getTopOfBook(symbols?: string[], dataSource?: DataSource): Promise<Quote[] | undefined>;
  getTopOfBook(directions?: CurrencyDirection[], dataSource?: DataSource): Promise<Quote[] | undefined>;
  async getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[], dataSource = DataSource.All): Promise<Quote[] | undefined> {
    const symbols = this.convertToSymbolsArray(symbolsOrDirections);
    const key = this.getTopOfBookCacheKey(symbols);

    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedQuotes = this.topOfBookCache.get<Quote[]>(key);
      if (cachedQuotes)
        return cachedQuotes;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const quotes = await (this.exchangeService.getTopOfBook as (symbolsOrDirections?: string[] | CurrencyDirection[]) => Promise<Quote[]>)(symbolsOrDirections);
      this.topOfBookCache.set(key, quotes);

      return quotes;
    }

    return undefined;
  }

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook | undefined> {
    let symbol: string;

    if (typeof symbolOrDirection === 'string')
      symbol = symbolOrDirection;
    else {
      const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
      symbol = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to)[0].name;
    }

    if (!symbol)
      throw new Error('Invalid Symbol');

    const orderBook = await this.exchangeService.getOrderBook(symbol);
    if (orderBook)
      this.orderBookProvider.setOrderBook(symbol, orderBook);

    return orderBook;
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    const proofsOfFunds = newOrderRequest.proofsOfFunds
      ? newOrderRequest.proofsOfFunds
      : this.createProofOfFunds(accountAddress, newOrderRequest);

    const filledNewOrderRequest: FilledNewOrderRequest = {
      clientOrderId: newOrderRequest.clientOrderId || nanoid(17),
      orderBody: newOrderRequest.orderBody,
      requisites: newOrderRequest.requisites,
      proofsOfFunds
    };

    return this.exchangeService.addOrder(accountAddress, filledNewOrderRequest);
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    return this.exchangeService.cancelOrder(accountAddress, cancelOrderRequest);
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    return this.exchangeService.cancelAllOrders(accountAddress, cancelAllOrdersRequest);
  }

  async getOrderPreview(orderPreviewParameters: OrderPreviewParameters | NormalizedOrderPreviewParameters): Promise<OrderPreview | undefined> {
    if (orderPreviewParameters.type !== 'SolidFillOrKill')
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');

    const normalizedPreviewParameters = this.normalizeOrderPreviewParametersIfNeeded(orderPreviewParameters);
    const orderBookEntry = await this.findOrderBookEntry(
      normalizedPreviewParameters.exchangeSymbol,
      normalizedPreviewParameters.side, orderPreviewParameters.type,
      normalizedPreviewParameters.amount,
      normalizedPreviewParameters.isBaseCurrencyAmount
    );
    if (!orderBookEntry)
      return undefined;

    const [from, to] = symbolsHelper.convertSymbolAndSideToFromAndToSymbolCurrencies(
      normalizedPreviewParameters.exchangeSymbol,
      normalizedPreviewParameters.side,
      normalizedPreviewParameters.amount,
      orderBookEntry.price,
      normalizedPreviewParameters.isBaseCurrencyAmount
    );

    return {
      type: orderPreviewParameters.type,
      from,
      to,
      side: normalizedPreviewParameters.side,
      symbol: normalizedPreviewParameters.exchangeSymbol.name,
    };
  }

  async getAvailableLiquidity(parameters: SymbolLiquidityParameters): Promise<SymbolLiquidity | undefined> {
    if (parameters.type !== 'SolidFillOrKill')
      throw new Error('Only the "SolidFillOrKill" order type is supported at the current moment');

    let symbol: string;
    let side: Side;

    if (parameters.symbol !== undefined) {
      symbol = parameters.symbol;
      side = parameters.side;
    } else {
      const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
      const exchangeSymbolAndSide = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, parameters.from, parameters.to);
      symbol = exchangeSymbolAndSide[0].name;
      side = exchangeSymbolAndSide[1];
    }

    const orderBook = await this.getCachedOrderBook(symbol);
    if (!orderBook)
      return undefined;

    const maxAmount = Math.max(
      ...orderBook.entries
        .filter(entry => entry.side != side)
        .map(entry => Math.max(...entry.qtyProfile)),
    );

    if (!isFinite(maxAmount) || isNaN(maxAmount) || maxAmount <= 0)
      return undefined;

    const amount = new BigNumber(maxAmount);
    const orderPreviewParameters: OrderPreviewParameters = parameters.symbol !== undefined ? {
      amount,
      symbol,
      side,
      type: parameters.type,
      isBaseCurrencyAmount: true
    } : {
      amount,
      type: parameters.type,
      from: parameters.from,
      to: parameters.to,
      isFromAmount: side === 'Sell'
    };

    const orderPreview = await this.getOrderPreview(orderPreviewParameters);
    if (!orderPreview)
      return undefined;

    return {
      symbol: orderPreview.symbol,
      type: orderPreview.type,
      from: orderPreview.from,
      to: orderPreview.to,
      side: orderPreview.side,
    };
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

  protected normalizeOrderPreviewParametersIfNeeded(orderPreviewParameters: OrderPreviewParameters | NormalizedOrderPreviewParameters): NormalizedOrderPreviewParameters {
    return ordersHelper.isNormalizedOrderPreviewParameters(orderPreviewParameters)
      ? orderPreviewParameters
      : ordersHelper.normalizeOrderPreviewParameters(orderPreviewParameters, this.symbolsProvider);
  }

  protected async findOrderBookEntry(exchangeSymbol: ExchangeSymbol, side: Side, orderType: OrderType, amount: BigNumber, isBaseCurrencyAmount: boolean) {
    if (orderType !== 'SolidFillOrKill')
      return undefined;

    const orderBook = await this.getCachedOrderBook(exchangeSymbol.name);
    if (!orderBook)
      return undefined;

    for (const entry of orderBook.entries) {
      if (entry.side === side)
        continue;

      const convertedAmount = isBaseCurrencyAmount
        ? amount
        : toFixedBigNumber(amount.div(entry.price), exchangeSymbol.decimals.quoteCurrency, BigNumber.ROUND_FLOOR);
      if (convertedAmount.isLessThanOrEqualTo(Math.max(...entry.qtyProfile)))
        return entry;
    }
  }

  protected createProofOfFunds(accountAddress: string, newOrderRequest: NewOrderRequest): ProofOfFunds[] {
    const authToken = this.authorizationManager.getAuthToken(accountAddress);
    if (!authToken)
      throw new Error(`Cannot find auth token for address: ${accountAddress}`);

    const _currency: Currency['id'] = ordersHelper.isOrderPreview(newOrderRequest.orderBody)
      ? newOrderRequest.orderBody.from.currencyId
      : symbolsHelper.convertSymbolAndSideToFromAndToCurrencies(newOrderRequest.orderBody.symbol, newOrderRequest.orderBody.side)[0];

    return [
      // {
      //   address: accountAddress,
      //   currency,
      //   timeStamp: authToken.request.timeStamp,
      //   message: authToken.request.message,
      //   publicKey: authToken.request.publicKey,
      //   signature: authToken.request.signature,
      //   algorithm: authToken.request.algorithm
      // }
    ];
  }

  protected getCachedOrderBook(symbol: string): Promise<OrderBook | undefined> {
    const cachedOrderBook = this.orderBookProvider.getOrderBook(symbol);

    return cachedOrderBook ? Promise.resolve(cachedOrderBook) : this.getOrderBook(symbol);
  }

  private getTopOfBookCacheKey(symbols: string[] | undefined) {
    let postfix;

    if (symbols && symbols.length) {
      symbols.sort();
      postfix = symbols.join(',');
    } else
      postfix = 'all';

    return `top-of-book_${postfix}`;
  }

  private convertToSymbolsArray(symbolsOrDirections?: string[] | CurrencyDirection[]) {
    let symbols: string[] | undefined = undefined;

    if (symbolsOrDirections?.length) {
      if (typeof symbolsOrDirections[0] === 'string')
        symbols = [...symbolsOrDirections] as string[];
      else {
        const exchangeSymbols = this.symbolsProvider.getSymbolsMap();
        symbols = (symbolsOrDirections as CurrencyDirection[])
          .map(d => symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, d.from, d.to)[0].name);
      }
    }

    return symbols;
  }
}
