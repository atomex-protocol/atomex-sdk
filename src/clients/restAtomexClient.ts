import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import { DeepRequired, EventEmitter } from '../core';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import { QuoteDto, SymbolDto } from './dtos';
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
  protected readonly requestSender;

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
    this.requestSender = new RequestSender(this.apiBaseUrl);
  }

  getOrder(orderId: string): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(selector?: CollectionSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
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

  getOrderBook(): Promise<OrderBook> {
    const url = `${this.apiBaseUrl}/v1/MarketData/book`;

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

  private mapQuoteDtosToQuotes(quoteDtos: QuoteDto[]): Quote[] {
    const quotes: Quote[] = [];
    for (const dto of quoteDtos) {
      const symbols = dto.symbol.split('/');

      quotes.push({
        ask: new BigNumber(dto.ask),
        bid: new BigNumber(dto.bid),
        symbol: dto.symbol,
        timeStamp: new Date(dto.timeStamp),
        quoteCurrency: symbols[0] || '',
        baseCurrency: symbols[1] || ''
      });
    }

    return quotes;
  }

  private mapSymbolDtosToSymbols(symbolDtos: SymbolDto[]): ExchangeSymbol[] {
    const symbols: ExchangeSymbol[] = [];
    for (const dto of symbolDtos) {
      symbols.push({
        name: dto.name,
        minimumQty: new BigNumber(dto.minimumQty)
      });
    }

    return symbols;
  }
}
