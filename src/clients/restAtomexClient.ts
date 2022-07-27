import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CancelAllSide, Currency, Side } from '../common/index';
import { EventEmitter } from '../core';
import {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  ExchangeServiceEvents, OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection
} from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import { getFromToCurrencies, getQuoteBaseCurrenciesBySymbol } from './currencyUtils';
import { CreatedOrderDto, OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto } from './dtos';
import { HttpClient } from './httpClient';

export interface RestAtomexClientOptions {
  atomexNetwork: AtomexNetwork; //TODO: Do we really need it?
  authorizationManager: AuthorizationManager;
  apiBaseUrl: string;
}

export class RestAtomexClient implements AtomexClient {
  readonly atomexNetwork: AtomexNetwork;

  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly apiBaseUrl: string;
  protected readonly httpClient: HttpClient;
  private _symbolsCache: ExchangeSymbol[] | undefined;

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
    this.httpClient = new HttpClient(this.apiBaseUrl);
  }

  async getOrder(accountAddress: string, orderId: number): Promise<Order | undefined> {
    const urlPath = `/v1/Orders/${orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    const orderDto = await this.httpClient.request<OrderDto>({ urlPath, authToken });

    return this.mapOrderDtoToOrder(orderDto);
  }

  async getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]> {
    const urlPath = '/v1/Orders';
    const authToken = this.getRequiredAuthToken(accountAddress);
    const params = {
      ...selector,
      sortAsc: undefined,
      sort: selector?.sortAsc !== undefined
        ? selector.sortAsc ? 'Asc' : 'Desc'
        : undefined,
    };

    const orderDtos = await this.httpClient.request<OrderDto[]>({ urlPath, authToken, params });

    return this.mapOrderDtosToOrders(orderDtos);
  }

  async getSymbols(): Promise<ExchangeSymbol[]> {
    const urlPath = '/v1/Symbols';
    const symbolDtos = await this.httpClient.request<SymbolDto[]>({ urlPath });

    const symbols = this.mapSymbolDtosToSymbols(symbolDtos);
    this._symbolsCache = symbols;

    return symbols;
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  async getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    const urlPath = '/v1/MarketData/quotes';
    let symbols: string[] | undefined = undefined;

    if (symbolsOrDirections?.length) {
      if (typeof symbolsOrDirections[0] === 'string')
        symbols = symbolsOrDirections as string[];
      else {
        const cachedSymbols = await this.getCachedSymbols();
        symbols = (symbolsOrDirections as CurrencyDirection[]).map(d => this.findSymbolAndSide(cachedSymbols, d.from, d.to)[0]);
      }
    }

    const params = { symbols: symbols?.join(',') };

    const quoteDtos = await this.httpClient.request<QuoteDto[]>({ urlPath, params });

    return this.mapQuoteDtosToQuotes(quoteDtos);
  }

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    const urlPath = '/v1/MarketData/book';
    let symbol: string;

    if (typeof symbolOrDirection === 'string')
      symbol = symbolOrDirection;
    else {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol] = this.findSymbolAndSide(cachedSymbols, symbolOrDirection.from, symbolOrDirection.to);
    }

    const params = { symbol };
    const orderBookDto = await this.httpClient.request<OrderBookDto>({ urlPath, params });

    return this.mapOrderBookDtoToOrderBook(orderBookDto);
  }

  async addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol: string | undefined = undefined;
    let side: Side | undefined = undefined;

    if (newOrderRequest.symbol && newOrderRequest.side)
      [symbol, side] = [newOrderRequest.symbol, newOrderRequest.side];
    else if (newOrderRequest.from && newOrderRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = this.findSymbolAndSide(cachedSymbols, newOrderRequest.from, newOrderRequest.to);
    }
    else
      throw new Error('Invalid newOrderRequest argument passed');

    const payload = {
      symbol,
      side,
      clientOrderId: newOrderRequest.clientOrderId,
      type: newOrderRequest.type,
      proofsOfFunds: newOrderRequest.proofsOfFunds,
      requisites: newOrderRequest.requisites,
      amount: newOrderRequest.amount.toNumber(),
      price: newOrderRequest.price.toNumber(),
    };

    const newOrderDto = await this.httpClient.request<CreatedOrderDto>({
      urlPath,
      authToken,
      method: 'POST',
      payload
    });

    return newOrderDto.orderId;
  }

  async cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    const urlPath = `/v1/Orders/${cancelOrderRequest.orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol: string | undefined = undefined;
    let side: Side | undefined = undefined;

    if (cancelOrderRequest.symbol && cancelOrderRequest.side)
      [symbol, side] = [cancelOrderRequest.symbol, cancelOrderRequest.side];
    else if (cancelOrderRequest.from && cancelOrderRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = this.findSymbolAndSide(cachedSymbols, cancelOrderRequest.from, cancelOrderRequest.to);
    }
    else
      throw new Error('Invalid cancelOrderRequest argument passed');

    const params = { symbol, side };

    const isSuccess = await this.httpClient.request<boolean>({
      urlPath,
      authToken,
      params,
      method: 'DELETE'
    });

    return isSuccess;
  }

  async cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const authToken = this.getRequiredAuthToken(accountAddress);

    let symbol: string | undefined = undefined;
    let side: CancelAllSide | undefined = undefined;

    if (cancelAllOrdersRequest.symbol && cancelAllOrdersRequest.side)
      [symbol, side] = [cancelAllOrdersRequest.symbol, cancelAllOrdersRequest.side];
    else if (cancelAllOrdersRequest.from && cancelAllOrdersRequest.to) {
      const cachedSymbols = await this.getCachedSymbols();
      [symbol, side] = this.findSymbolAndSide(cachedSymbols, cancelAllOrdersRequest.from, cancelAllOrdersRequest.to);

      if (cancelAllOrdersRequest.cancelAllDirections)
        side = 'All';
    }
    else
      throw new Error('Invalid cancelAllOrdersRequest argument passed');

    const canceledOrdersCount = await this.httpClient.request<number>({
      urlPath,
      authToken,
      params: {
        symbol,
        side,
        forAllConnections: cancelAllOrdersRequest.forAllConnections
      },
      method: 'DELETE'
    });

    return canceledOrdersCount;
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  async getSwap(accountAddress: string, swapId: number): Promise<Swap> {
    const urlPath = `/v1/Swaps/${swapId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);

    const swapDto = await this.httpClient.request<SwapDto>({
      urlPath,
      authToken
    });

    return this.mapSwapDtoToSwap(swapDto);
  }

  async getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]> {
    const urlPath = '/v1/Swaps';
    const authToken = this.getRequiredAuthToken(accountAddress);
    const params = {
      ...selector,
      sortAsc: undefined,
      sort: selector?.sortAsc !== undefined
        ? selector.sortAsc ? 'Asc' : 'Desc'
        : undefined,
    };

    const swapDtos = await this.httpClient.request<SwapDto[]>({
      urlPath,
      params,
      authToken
    });

    return this.mapSwapDtosToSwaps(swapDtos);
  }

  private getRequiredAuthToken(accountAddress: string): string {
    const authToken = this.authorizationManager.getAuthToken(accountAddress)?.value;

    if (!authToken) {
      throw new Error(`Cannot find auth token for address: ${accountAddress}`);
    }

    return authToken;
  }

  private async getCachedSymbols() {
    if (!this._symbolsCache)
      this._symbolsCache = await this.getSymbols();

    return this._symbolsCache;
  }

  private findSymbolAndSide(symbols: ExchangeSymbol[], from: Currency['id'], to: Currency['id']): [symbol: string, side: Side] {
    let symbol = symbols.find(s => s.name === `${from}/${to}`);
    let side: Side = 'Sell';

    if (!symbol) {
      symbol = symbols.find(s => s.name === `${to}/${from}`);
      side = 'Buy';
    }

    if (!symbol)
      throw new Error(`Invalid pair: ${from}/${to}`);

    return [symbol.name, side];
  }

  private mapQuoteDtosToQuotes(quoteDtos: QuoteDto[]): Quote[] {
    const quotes: Quote[] = quoteDtos.map(dto => {
      const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(dto.symbol);

      return {
        ask: new BigNumber(dto.ask),
        bid: new BigNumber(dto.bid),
        symbol: dto.symbol,
        timeStamp: new Date(dto.timeStamp),
        quoteCurrency,
        baseCurrency
      };
    });

    return quotes;
  }

  private mapSymbolDtosToSymbols(symbolDtos: SymbolDto[]): ExchangeSymbol[] {
    const symbols: ExchangeSymbol[] = symbolDtos.map(dto => {
      const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(dto.name);

      return {
        name: dto.name,
        minimumQty: new BigNumber(dto.minimumQty),
        quoteCurrency,
        baseCurrency
      };
    });

    return symbols;
  }

  private mapOrderBookDtoToOrderBook(orderBookDto: OrderBookDto): OrderBook {
    const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(orderBookDto.symbol);

    const orderBook: OrderBook = {
      updateId: orderBookDto.updateId,
      symbol: orderBookDto.symbol,
      quoteCurrency,
      baseCurrency,
      entries: orderBookDto.entries.map(e => ({
        side: e.side,
        price: new BigNumber(e.price),
        qtyProfile: e.qtyProfile
      }))
    };

    return orderBook;
  }

  private mapOrderDtoToOrder(orderDto: OrderDto): Order {
    const [from, to] = getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);

    return {
      id: orderDto.id,
      from,
      to,
      clientOrderId: orderDto.clientOrderId,
      side: orderDto.side,
      symbol: orderDto.symbol,
      leaveQty: new BigNumber(orderDto.leaveQty),
      timeStamp: new Date(orderDto.timeStamp),
      type: orderDto.type,
      status: orderDto.status,
      swapIds: orderDto.swaps?.map(s => s.id) || [],
    };
  }

  private mapOrderDtosToOrders(orderDtos: OrderDto[]): Order[] {
    const orders = orderDtos.map(dto => this.mapOrderDtoToOrder(dto));

    return orders;
  }

  private mapSwapDtoToSwap(swapDto: SwapDto): Swap {
    const [from, to] = getFromToCurrencies(swapDto.symbol, swapDto.qty, swapDto.price, swapDto.side);

    const swap: Swap = {
      isInitiator: swapDto.isInitiator,
      secret: swapDto.secret,
      secretHash: swapDto.secretHash,
      id: Number(swapDto.id),
      from,
      to,
      trade: {
        qty: new BigNumber(swapDto.qty),
        price: new BigNumber(swapDto.price),
        side: swapDto.side,
        symbol: swapDto.symbol
      },
      timeStamp: new Date(swapDto.timeStamp),
      counterParty: {
        status: swapDto.counterParty.status,
        transactions: swapDto.counterParty.transactions,
        requisites: {
          ...swapDto.counterParty.requisites,
          rewardForRedeem: new BigNumber(swapDto.counterParty.requisites.rewardForRedeem),
        },
        trades: swapDto.counterParty.trades.map(t => ({
          orderId: t.orderId,
          price: new BigNumber(t.price),
          qty: new BigNumber(t.qty),
        })),
      },
      user: {
        status: swapDto.user.status,
        transactions: swapDto.user.transactions,
        requisites: {
          ...swapDto.user.requisites,
          rewardForRedeem: new BigNumber(swapDto.user.requisites.rewardForRedeem),
        },
        trades: swapDto.user.trades.map(t => ({
          orderId: t.orderId,
          price: new BigNumber(t.price),
          qty: new BigNumber(t.qty),
        })),
      },
    };

    return swap;
  }

  private mapSwapDtosToSwaps(swapDtos: SwapDto[]): Swap[] {
    const swaps = swapDtos.map(dto => this.mapSwapDtoToSwap(dto));

    return swaps;
  }
}
