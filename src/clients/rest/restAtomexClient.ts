import type BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork, CancelAllSide, CurrenciesProvider, Side } from '../../common/index';
import { EventEmitter } from '../../core';
import { HttpClient } from '../../core/index';
import {
  symbolsHelper, ordersHelper,
  Order, OrderBook, Quote, ExchangeSymbol, OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection, ExchangeSymbolsProvider, FilledNewOrderRequest
} from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
import type { CreatedOrderDto, NewOrderRequestDto, OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto } from '../dtos';
import {
  mapOrderBookDtoToOrderBook, mapOrderDtosToOrders, mapOrderDtoToOrder,
  mapQuoteDtosToQuotes, mapSwapDtosToSwaps, mapSwapDtoToSwap, mapSymbolDtosToSymbols
} from '../helpers';

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
    orderBookSnapshot: new EventEmitter(),
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
        symbols = (symbolsOrDirections as CurrencyDirection[])
          .map(d => symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, d.from, d.to)[0].name);
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
      symbol = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, symbolOrDirection.from, symbolOrDirection.to)[0].name;
    }

    const params = { symbol };
    const orderBookDto = await this.httpClient.request<OrderBookDto>({ urlPath, params });

    return orderBookDto ? mapOrderBookDtoToOrderBook(orderBookDto) : undefined;
  }

  async addOrder(accountAddress: string, newOrderRequest: FilledNewOrderRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const authToken = this.getRequiredAuthToken(accountAddress);
    let symbol: string | undefined = undefined;
    let side: Side | undefined = undefined;
    let amountBigNumber: BigNumber;
    let priceBigNumber: BigNumber;

    if (ordersHelper.isOrderPreview(newOrderRequest.orderBody)) {
      symbol = newOrderRequest.orderBody.symbol;
      side = newOrderRequest.orderBody.side;

      const baseCurrencyId = symbolsHelper.getBaseQuoteCurrenciesBySymbol(symbol)[0];
      const directionName: 'from' | 'to' = baseCurrencyId === newOrderRequest.orderBody.from.currencyId ? 'from' : 'to';

      amountBigNumber = newOrderRequest.orderBody[directionName].amount;
      priceBigNumber = newOrderRequest.orderBody[directionName].price;
    }
    else {
      [symbol, side] = [newOrderRequest.orderBody.symbol, newOrderRequest.orderBody.side];
      amountBigNumber = newOrderRequest.orderBody.amount;
      priceBigNumber = newOrderRequest.orderBody.price;
    }

    // TODO: move to the mapper
    const payload: NewOrderRequestDto = {
      clientOrderId: newOrderRequest.clientOrderId,
      symbol,
      side,
      type: newOrderRequest.orderBody.type,
      requisites: newOrderRequest.requisites ? {
        secretHash: newOrderRequest.requisites.secretHash,
        receivingAddress: newOrderRequest.requisites.receivingAddress,
        refundAddress: newOrderRequest.requisites.refundAddress,
        rewardForRedeem: newOrderRequest.requisites.rewardForRedeem.toNumber(),
        lockTime: newOrderRequest.requisites.lockTime,
        quoteCurrencyContract: newOrderRequest.requisites.quoteCurrencyContract,
        baseCurrencyContract: newOrderRequest.requisites.baseCurrencyContract
      } : undefined,
      proofsOfFunds: newOrderRequest.proofsOfFunds,
      qty: amountBigNumber.toNumber(),
      price: priceBigNumber.toNumber()
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
      const exchangeSymbolAndSide = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, cancelOrderRequest.from, cancelOrderRequest.to);
      symbol = exchangeSymbolAndSide[0].name;
      side = exchangeSymbolAndSide[1];
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
      const exchangeSymbolAndSide = symbolsHelper.convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, cancelAllOrdersRequest.from, cancelAllOrdersRequest.to);
      symbol = exchangeSymbolAndSide[0].name;
      side = exchangeSymbolAndSide[1];

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
