import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { EventEmitter } from '../core';
import { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents, OrdersSelector } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import { OrderBookDto, OrderDto, QuoteDto, SymbolDto } from './dtos';
import { RequestSender } from './requestSender';

export interface RestAtomexClientOptions {
  atomexNetwork: AtomexNetwork; //Do we really need it?
  authorizationManager: AuthorizationManager;
  apiBaseUrl: string;
}

export class RestAtomexClient implements AtomexClient {
  readonly atomexNetwork: AtomexNetwork;

  readonly events: ExchangeServiceEvents = {
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly apiBaseUrl: string;
  protected readonly requestSender: RequestSender;

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
    this.requestSender = new RequestSender(this.apiBaseUrl);
  }

  async getOrder(orderId: number): Promise<Order | undefined> {
    const urlPath = `/v1/Orders/${orderId}`;
    const orderDto = await this.requestSender.send<OrderDto>({ urlPath });

    return this.mapOrderDtoToOrder(orderDto);
  }

  async getOrders(selector?: OrdersSelector | undefined): Promise<Order[]> {
    const urlPath = '/v1/Orders';
    const params = {
      ...selector,
      sortAsc: undefined,
      sort: selector?.sortAsc !== undefined
        ? selector.sortAsc ? 'Asc' : 'Desc'
        : undefined,
    };

    const orderDtos = await this.requestSender.send<OrderDto[]>({ urlPath, params });

    return this.mapOrderDtosToOrders(orderDtos);
  }

  async getSymbols(): Promise<ExchangeSymbol[]> {
    const urlPath = '/v1/Symbols';
    const symbolDtos = await this.requestSender.send<SymbolDto[]>({ urlPath });

    return this.mapSymbolDtosToSymbols(symbolDtos);
  }

  async getTopOfBook(symbols?: string[]): Promise<Quote[]> {
    const urlPath = '/v1/MarketData/quotes';
    const params = symbols && symbols.length
      ? { symbols: symbols.join(',') }
      : undefined;

    const quoteDtos = await this.requestSender.send<QuoteDto[]>({ urlPath, params });

    return this.mapQuoteDtosToQuotes(quoteDtos);
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const urlPath = '/v1/MarketData/book';
    const params = { symbol };
    const orderBookDto = await this.requestSender.send<OrderBookDto>({ urlPath, params });

    return this.mapOrderBookDtoToOrderBook(orderBookDto);
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

  private mapQuoteDtosToQuotes(quoteDtos: QuoteDto[]): Quote[] {
    const quotes: Quote[] = quoteDtos.map(dto => {
      const [quoteCurrency, baseCurrency] = this.getQuoteBaseCurrenciesBySymbol(dto.symbol);

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
    const symbols: ExchangeSymbol[] = symbolDtos.map(dto => ({
      name: dto.name,
      minimumQty: new BigNumber(dto.minimumQty)
    }));

    return symbols;
  }

  private mapOrderBookDtoToOrderBook(orderBookDto: OrderBookDto): OrderBook {
    const [quoteCurrency, baseCurrency] = this.getQuoteBaseCurrenciesBySymbol(orderBookDto.symbol);

    const orderBook: OrderBook = {
      updateId: orderBookDto.updateId,
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
    const [quoteCurrencyId, baseCurrencyId] = this.getQuoteBaseCurrenciesBySymbol(orderDto.symbol);

    const quoteCurrencyAmount = new BigNumber(orderDto.qty);
    const quoteCurrencyPrice = new BigNumber(orderDto.price);
    const baseCurrencyAmount = quoteCurrencyPrice.multipliedBy(quoteCurrencyAmount);
    const baseCurrencyPrice = quoteCurrencyAmount.div(baseCurrencyAmount);

    const quoteCurrency: Order['from'] = {
      currencyId: quoteCurrencyId,
      amount: quoteCurrencyAmount,
      price: quoteCurrencyPrice,
    };

    const baseCurrency: Order['from'] = {
      currencyId: baseCurrencyId,
      amount: baseCurrencyAmount,
      price: baseCurrencyPrice,
    };

    return {
      id: orderDto.id,
      clientOrderId: orderDto.clientOrderId,
      side: orderDto.side,
      symbol: orderDto.symbol,
      leaveQty: new BigNumber(orderDto.leaveQty),
      timeStamp: new Date(orderDto.timeStamp),
      type: orderDto.type,
      status: orderDto.status,
      swapIds: orderDto.swaps?.map(s => s.id) || [],
      from: orderDto.side === 'Buy' ? baseCurrency : quoteCurrency,
      to: orderDto.side === 'Buy' ? quoteCurrency : baseCurrency
    };
  }

  private mapOrderDtosToOrders(orderDtos: OrderDto[]): Order[] {
    const orders = orderDtos.map(dto => this.mapOrderDtoToOrder(dto));

    return orders;
  }

  private getQuoteBaseCurrenciesBySymbol(symbol: string): [quoteCurrency: string, baseCurrency: string] {
    const [quoteCurrency = '', baseCurrency = ''] = symbol.split('/');

    return [quoteCurrency, baseCurrency];
  }
}
