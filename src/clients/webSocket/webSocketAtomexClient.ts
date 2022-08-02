import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { EventEmitter, type ToEventEmitter } from '../../core';
import type {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection
} from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
import type { WebSocketResponseDto } from '../dtos';
import { mapQuoteDtosToQuotes, mapSwapDtoToSwap, mapWebSocketOrderBookEntryDtoToOrderBook, mapWebSocketOrderDtoToOrder } from '../helpers';
import { ExchangeWebSocketClient } from './exchangeWebSocketClient';
import { MarketDataWebSocketClient } from './marketDataWebSocketClient';

export interface WebSocketAtomexClientOptions {
  atomexNetwork: AtomexNetwork;
  authorizationManager: AuthorizationManager;
  webSocketApiBaseUrl: string;
}

export class WebSocketAtomexClient implements AtomexClient {
  readonly atomexNetwork: AtomexNetwork;
  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly webSocketApiBaseUrl: string;
  protected readonly marketDataWebSocketClient: MarketDataWebSocketClient;
  protected readonly exchangeWebSocketClient: ExchangeWebSocketClient;

  constructor(options: WebSocketAtomexClientOptions) {
    this.onSocketMessageReceived = this.onSocketMessageReceived.bind(this);

    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.webSocketApiBaseUrl = options.webSocketApiBaseUrl;

    this.exchangeWebSocketClient = new ExchangeWebSocketClient(this.webSocketApiBaseUrl, this.authorizationManager);
    this.exchangeWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);

    this.marketDataWebSocketClient = new MarketDataWebSocketClient(this.webSocketApiBaseUrl);
    this.marketDataWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.connect();
  }

  getOrder(_accountAddress: string, _orderId: number): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(_accountAddress: string, _selector?: OrdersSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    throw new Error('Method not implemented.');
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(_symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    throw new Error('Method not implemented.');
  }

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(_symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    throw new Error('Method not implemented.');
  }

  addOrder(_accountAddress: string, _newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(_accountAddress: string, _cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(_accountAddress: string, _cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getSwap(_accountAddresses: string[], _swapId: number): Promise<Swap> {
    throw new Error('Method not implemented.');
  }

  getSwaps(_accountAddresses: string[], _selector?: SwapsSelector): Promise<Swap[]> {
    throw new Error('Method not implemented.');
  }

  dispose() {
    this.exchangeWebSocketClient.dispose();
    this.marketDataWebSocketClient.dispose();
  }

  protected onSocketMessageReceived(message: WebSocketResponseDto) {
    switch (message.event) {
      case 'order':
        (this.events.orderUpdated as ToEventEmitter<typeof this.events.orderUpdated>).emit(mapWebSocketOrderDtoToOrder(message.data));
        break;

      case 'swap':
        (this.events.swapUpdated as ToEventEmitter<typeof this.events.swapUpdated>).emit(mapSwapDtoToSwap(message.data));
        break;

      case 'topOfBook':
        (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(mapQuoteDtosToQuotes(message.data));
        break;

      case 'entries':
        (this.events.orderBookUpdated as ToEventEmitter<typeof this.events.orderBookUpdated>).emit(mapWebSocketOrderBookEntryDtoToOrderBook(message.data));
        break;
    }
  }
}
