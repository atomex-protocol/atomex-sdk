import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import { DeepRequired, EventEmitter } from '../core';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import { QuoteDto } from './dtos';

export interface RestAtomexClientOptions {
  atomexNetwork: AtomexNetwork; //Do we really need it?
  authorizationManager: AuthorizationManager;
  apiBaseUrl: string;
}

interface SendRequestOptions {
  urlPath: string;
  params?: { [key: string]: string };
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

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
  }

  getOrder(orderId: string): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(selector?: CollectionSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol> {
    throw new Error('Method not implemented.');
  }

  async getTopOfBook(symbols?: string[]): Promise<Quote[]> {
    const urlPath = '/v1/MarketData/quotes';
    const params = symbols && symbols.length
      ? { symbols: symbols.join(',') }
      : undefined;

    const quotesDto = await this.sendRequest<QuoteDto[]>({ urlPath, params });

    return this.mapQuoteDtosToQuotes(quotesDto);
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

  private async sendRequest<T>(options: SendRequestOptions): Promise<T> {
    const url = new URL(options.urlPath, this.apiBaseUrl);

    if (options.params)
      this.setSearchParams(url, options.params);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errBody = await response.text();
      throw Error(errBody);
    }

    return await response.json();
  }

  private setSearchParams(url: URL, params: DeepRequired<SendRequestOptions['params']>) {
    for (const key in params) {
      const value = params[key];
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  private mapQuoteDtosToQuotes(quoteDtos: QuoteDto[]): Quote[] {
    const quotes: Quote[] = [];
    for (const dto of quoteDtos) {
      quotes.push({
        ask: new BigNumber(dto.ask),
        bid: new BigNumber(dto.bid),
        symbol: dto.symbol,
        timeStamp: new Date(dto.timeStamp),
        baseCurrency: '',
        quoteCurrency: ''
      });
    }

    return quotes;
  }
}
