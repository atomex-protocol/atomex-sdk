import type BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork, CancelAllSide, CurrenciesProvider, Side } from '../../common/index';
import { EventEmitter } from '../../core';
import {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection, symbolsHelper, ExchangeSymbolsProvider
} from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
import type { CreatedOrderDto, OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto } from '../dtos';
import {
  isOrderPreview,
  mapOrderBookDtoToOrderBook, mapOrderDtosToOrders, mapOrderDtoToOrder,
  mapQuoteDtosToQuotes, mapSwapDtosToSwaps, mapSwapDtoToSwap, mapSymbolDtosToSymbols
} from '../helpers';
import { HttpClient } from './httpClient';

export interface RestAtomexClientOptions {
  atomexNetwork: AtomexNetwork;
  authorizationManager: AuthorizationManager;
  currenciesProvider: CurrenciesProvider;
  exchangeSymbolsProvider: ExchangeSymbolsProvider;
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
  protected readonly currenciesProvider: CurrenciesProvider;
  protected readonly exchangeSymbolsProvider: ExchangeSymbolsProvider;
  protected readonly apiBaseUrl: string;
  protected readonly httpClient: HttpClient;

  private _isStarted = false;

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.currenciesProvider = options.currenciesProvider;
    this.exchangeSymbolsProvider = options.exchangeSymbolsProvider;
    this.apiBaseUrl = options.apiBaseUrl;
    this.httpClient = new HttpClient(this.apiBaseUrl);
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this._isStarted = false;
  }

  async getOrder(accountAddress: string, orderId: number): Promise<Order | undefined> {
    const urlPath = `/v1/Orders/${orderId}`;
    const authToken = this.getRequiredAuthToken(accountAddress);
    const orderDto = await this.httpClient.request<OrderDto>({ urlPath, authToken });

    return orderDto ? mapOrderDtoToOrder(orderDto, this.exchangeSymbolsProvider) : undefined;
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

    return orderDtos ? mapOrderDtosToOrders(orderDtos, this.exchangeSymbolsProvider) : [];
  }

  async getSymbols(): Promise<ExchangeSymbol[]> {
    const urlPath = '/v1/Symbols';
    const symbolDtos = await this.httpClient.request<SymbolDto[]>({ urlPath });

    return symbolDtos ? mapSymbolDtosToSymbols(symbolDtos, this.currenciesProvider) : [];
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
        const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
        symbols = (symbolsOrDirections as CurrencyDirection[]).map(d => symbolsHelper.findSymbolAndSide(exchangeSymbols, d.from, d.to)[0]);
      }
    }

    const params = { symbols: symbols?.join(',') };

    const quoteDtos = await this.httpClient.request<QuoteDto[]>({ urlPath, params });

    return quoteDtos ? mapQuoteDtosToQuotes(quoteDtos) : [];
  }

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook | undefined> {
    const urlPath = '/v1/MarketData/book';
    let symbol: string;

    if (typeof symbolOrDirection === 'string')
      symbol = symbolOrDirection;
    else {
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      [symbol] = symbolsHelper.findSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to);
    }

    const params = { symbol };
    const orderBookDto = await this.httpClient.request<OrderBookDto>({ urlPath, params });

    return orderBookDto ? mapOrderBookDtoToOrderBook(orderBookDto) : undefined;
  }

  async addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol: string | undefined = undefined;
    let side: Side | undefined = undefined;

    if (newOrderRequest.orderBody.symbol && newOrderRequest.orderBody.side)
      [symbol, side] = [newOrderRequest.orderBody.symbol, newOrderRequest.orderBody.side];
    else if (typeof newOrderRequest.orderBody.from === 'string' && typeof newOrderRequest.orderBody.to === 'string') {
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      [symbol, side] = symbolsHelper.findSymbolAndSide(exchangeSymbols, newOrderRequest.orderBody.from, newOrderRequest.orderBody.to);
    }
    else
      throw new Error('Invalid newOrderRequest argument passed');

    let amountBigNumber: BigNumber;
    let priceBigNumber: BigNumber;
    if (isOrderPreview(newOrderRequest.orderBody)) {
      amountBigNumber = newOrderRequest.orderBody.from.amount;
      priceBigNumber = newOrderRequest.orderBody.from.price;
    }
    else {
      amountBigNumber = newOrderRequest.orderBody.fromAmount;
      priceBigNumber = newOrderRequest.orderBody.price;
    }

    const payload = {
      symbol,
      side,
      clientOrderId: newOrderRequest.clientOrderId,
      type: newOrderRequest.orderBody.type,
      proofsOfFunds: newOrderRequest.proofsOfFunds,
      requisites: newOrderRequest.requisites,
      amount: amountBigNumber.toNumber(),
      price: priceBigNumber.toNumber(),
    };

    const newOrderDto = await this.httpClient.request<CreatedOrderDto>({
      urlPath,
      authToken,
      method: 'POST',
      payload
    });

    if (newOrderDto === undefined)
      throw new Error('Unexpected response dto');

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
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      [symbol, side] = symbolsHelper.findSymbolAndSide(exchangeSymbols, cancelOrderRequest.from, cancelOrderRequest.to);
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

    if (isSuccess === undefined)
      throw new Error('Unexpected response dto');

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
      const exchangeSymbols = this.exchangeSymbolsProvider.getSymbolsMap();
      [symbol, side] = symbolsHelper.findSymbolAndSide(exchangeSymbols, cancelAllOrdersRequest.from, cancelAllOrdersRequest.to);

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

    if (canceledOrdersCount === undefined)
      throw new Error('Unexpected response dto');

    return canceledOrdersCount;
  }

  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  async getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
  async getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
  async getSwap(swapId: number, addressOrAddresses: string | string[]): Promise<Swap | undefined> {
    const urlPath = `/v1/Swaps/${swapId}`;

    const userIds = this.getUserIds(addressOrAddresses);
    const params = {
      userIds: userIds.join(',')
    };

    const swapDto = await this.httpClient.request<SwapDto>({
      urlPath,
      params
    });

    return swapDto ? mapSwapDtoToSwap(swapDto, this.exchangeSymbolsProvider) : undefined;
  }

  async getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
  async getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
  async getSwaps(addressOrAddresses: string | string[], selector?: SwapsSelector): Promise<Swap[]> {
    const urlPath = '/v1/Swaps';

    const userIds = this.getUserIds(addressOrAddresses);
    const params = {
      ...selector,
      sortAsc: undefined,
      sort: selector?.sortAsc !== undefined
        ? selector.sortAsc ? 'Asc' : 'Desc'
        : undefined,
      userIds: userIds.join(',')
    };

    const swapDtos = await this.httpClient.request<SwapDto[]>({
      urlPath,
      params
    });

    return swapDtos ? mapSwapDtosToSwaps(swapDtos, this.exchangeSymbolsProvider) : [];
  }

  private getUserIds(addressOrAddresses: string | string[]) {
    const accountAddresses = Array.isArray(addressOrAddresses) ? addressOrAddresses : [addressOrAddresses];

    const userIds = accountAddresses
      .map(address => this.authorizationManager.getAuthToken(address)?.userId)
      .filter(userId => userId);

    if (!userIds.length)
      throw new Error('Incorrect accountAddresses');

    return userIds;
  }

  private getRequiredAuthToken(accountAddress: string): string {
    const authToken = this.authorizationManager.getAuthToken(accountAddress)?.value;

    if (!authToken)
      throw new Error(`Cannot find auth token for address: ${accountAddress}`);

    return authToken;
  }
}
