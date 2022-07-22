import BigNumber from 'bignumber.js';

import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, Currency, Side } from '../common/index';
import { EventEmitter } from '../core';
import { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, OrderCurrency } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import { CreatedOrderDto, OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto } from './dtos';
import { HttpClient } from './httpClient';

export interface RestAtomexClientOptions {
  atomexNetwork: AtomexNetwork; //TODO: Do we really need it?
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
  protected readonly httpClient: HttpClient;

  constructor(options: RestAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.apiBaseUrl = options.apiBaseUrl;
    this.httpClient = new HttpClient(this.apiBaseUrl);
  }

  async getOrder(orderId: number): Promise<Order | undefined> {
    const urlPath = `/v1/Orders/${orderId}`;
    const authToken = this.authorizationManager.getAuthToken('')?.value;
    const orderDto = await this.httpClient.request<OrderDto>({ urlPath, authToken });

    return this.mapOrderDtoToOrder(orderDto);
  }

  async getOrders(selector?: OrdersSelector | undefined): Promise<Order[]> {
    const urlPath = '/v1/Orders';
    const authToken = this.authorizationManager.getAuthToken('')?.value;
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

    return this.mapSymbolDtosToSymbols(symbolDtos);
  }

  async getTopOfBook(symbols?: string[]): Promise<Quote[]> {
    const urlPath = '/v1/MarketData/quotes';
    const params = symbols && symbols.length
      ? { symbols: symbols.join(',') }
      : undefined;

    const quoteDtos = await this.httpClient.request<QuoteDto[]>({ urlPath, params });

    return this.mapQuoteDtosToQuotes(quoteDtos);
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const urlPath = '/v1/MarketData/book';
    const params = { symbol };
    const orderBookDto = await this.httpClient.request<OrderBookDto>({ urlPath, params });

    return this.mapOrderBookDtoToOrderBook(orderBookDto);
  }

  async addOrder(newOrderRequest: NewOrderRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const address = newOrderRequest.requisites?.receivingAddress || '';
    const authToken = this.authorizationManager.getAuthToken(address)?.value;

    const symbols = await this.getSymbols();
    const symbolInfo = this.findExchangeSymbolAndSide(symbols, newOrderRequest.from, newOrderRequest.to);

    if (!symbolInfo)
      throw new Error('Invalid symbols');

    const payload = {
      symbol: symbolInfo[0].name,
      side: symbolInfo[1],
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

  async cancelOrder(cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    const urlPath = `/v1/Orders/${cancelOrderRequest.orderId}`;
    const authToken = this.authorizationManager.getAuthToken('')?.value;
    const params = {
      symbol: cancelOrderRequest.symbol,
      side: cancelOrderRequest.side
    };

    const isSuccess = await this.httpClient.request<boolean>({
      urlPath,
      authToken,
      params,
      method: 'DELETE'
    });

    return isSuccess;
  }

  async cancelAllOrders(cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    const urlPath = '/v1/Orders';
    const authToken = this.authorizationManager.getAuthToken('')?.value;

    const canceledOrdersCount = await this.httpClient.request<number>({
      urlPath,
      authToken,
      params: { ...cancelAllOrdersRequest },
      method: 'DELETE'
    });

    return canceledOrdersCount;
  }

  //TODO: Do we need it? swap already has required props
  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  async getSwap(swapId: number): Promise<Swap> {
    const urlPath = `/v1/Swaps/${swapId}`;
    const authToken = this.authorizationManager.getAuthToken('')?.value;

    const swapDtos = await this.httpClient.request<SwapDto>({
      urlPath,
      authToken
    });

    return this.mapSwapDtoToSwap(swapDtos);
  }

  private findExchangeSymbolAndSide(symbols: ExchangeSymbol[], from: Currency['id'], to: Currency['id']): [ExchangeSymbol, Side] | undefined {
    let symbol = symbols.find(s => s.name === `${from}/${to}`);
    let side: Side = 'Sell';

    if (!symbol) {
      symbol = symbols.find(s => s.name === `${to}/${from}`);
      side = 'Buy';
    }

    return symbol ? [symbol, side] : undefined;
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
    const [from, to] = this.getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);
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
    const [from, to] = this.getFromToCurrencies(swapDto.symbol, swapDto.qty, swapDto.price, swapDto.side);

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

  private getQuoteBaseCurrenciesBySymbol(symbol: string): [quoteCurrency: string, baseCurrency: string] {
    const [quoteCurrency = '', baseCurrency = ''] = symbol.split('/');

    return [quoteCurrency, baseCurrency];
  }

  private getFromToCurrencies(symbol: string, qty: number, price: number, side: Side): [from: OrderCurrency, to: OrderCurrency] {
    const [quoteCurrencyId, baseCurrencyId] = this.getQuoteBaseCurrenciesBySymbol(symbol);

    const quoteCurrencyAmount = new BigNumber(qty);
    const quoteCurrencyPrice = new BigNumber(price);
    const baseCurrencyAmount = quoteCurrencyPrice.multipliedBy(quoteCurrencyAmount);
    const baseCurrencyPrice = quoteCurrencyAmount.div(baseCurrencyAmount);

    const quoteCurrency: OrderCurrency = {
      currencyId: quoteCurrencyId,
      amount: quoteCurrencyAmount,
      price: quoteCurrencyPrice,
    };

    const baseCurrency: OrderCurrency = {
      currencyId: baseCurrencyId,
      amount: baseCurrencyAmount,
      price: baseCurrencyPrice,
    };

    return side === 'Buy'
      ? [baseCurrency, quoteCurrency]
      : [quoteCurrency, baseCurrency];
  }
}
