import type { AuthorizationManager, AuthToken } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { EventEmitter, type ToEventEmitter } from '../core';
import type {
  Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest,
  OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection
} from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
import type { WebSocketResponseDto } from './dtos';
import { mapSwapDtoToSwap, mapWebSocketOrderDtoToOrder } from './mapper';
import { WebSocketClient } from './webSocketClient';

export interface WebSocketAtomexClientOptions {
  atomexNetwork: AtomexNetwork;
  authorizationManager: AuthorizationManager;
  webSocketApiBaseUrl: string;
}

export class WebSocketAtomexClient implements AtomexClient {
  static readonly EXCHANGE_URL_PATH = '/ws/exchange';
  static readonly MARKET_DATA_URL_PATH = '/ws/marketdata';

  readonly atomexNetwork: AtomexNetwork;
  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly webSocketApiBaseUrl: string;
  protected readonly sockets: Map<string, WebSocketClient> = new Map();

  constructor(options: WebSocketAtomexClientOptions) {
    this.onAuthorized = this.onAuthorized.bind(this);
    this.onUnauthorized = this.onUnauthorized.bind(this);
    this.onSocketMessageReceived = this.onSocketMessageReceived.bind(this);
    this.onSocketClosed = this.onSocketClosed.bind(this);

    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.webSocketApiBaseUrl = options.webSocketApiBaseUrl;

    this.subscribeOnEvents();
  }

  getOrder(accountAddress: string, orderId: number): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    throw new Error('Method not implemented.');
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    throw new Error('Method not implemented.');
  }

  getOrderBook(symbol: string): Promise<OrderBook>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
  async getOrderBook(symbolOrDirection: string | CurrencyDirection): Promise<OrderBook> {
    throw new Error('Method not implemented.');
  }

  addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getSwap(accountAddress: string, swapId: number): Promise<Swap> {
    throw new Error('Method not implemented.');
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]> {
    throw new Error('Method not implemented.');
  }

  dispose() {
    this.sockets.forEach((_, userId) => {
      this.removeSocket(userId);
    });
  }

  protected subscribeOnEvents() {
    this.authorizationManager.events.authorized.addListener(this.onAuthorized);
    this.authorizationManager.events.unauthorized.addListener(this.onUnauthorized);
  }

  protected onAuthorized(authToken: AuthToken) {
    this.removeSocket(authToken.userId);

    const socket = new WebSocketClient(new URL(WebSocketAtomexClient.EXCHANGE_URL_PATH, this.webSocketApiBaseUrl), authToken.value);
    socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    socket.events.closed.addListener(this.onSocketClosed);

    this.sockets.set(authToken.userId, socket);
    socket.connect();
  }

  protected onUnauthorized(authToken: AuthToken) {
    this.removeSocket(authToken.userId);
  }

  protected removeSocket(userId: string) {
    const socket = this.sockets.get(userId);

    if (socket) {
      socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
      socket.events.closed.removeListener(this.onSocketClosed);
      this.sockets.delete(userId);
      socket.disconnect();
    }
  }

  protected onSocketMessageReceived(message: WebSocketResponseDto) {
    switch (message.event) {
      case 'order':
        (this.events.orderUpdated as ToEventEmitter<typeof this.events.orderUpdated>).emit(mapWebSocketOrderDtoToOrder(message.data));
        break;

      case 'swap':
        (this.events.swapUpdated as ToEventEmitter<typeof this.events.swapUpdated>).emit(mapSwapDtoToSwap(message.data));
        break;

      default:
        break;
    }
  }

  protected onSocketClosed(closedSocket: WebSocketClient, _event: CloseEvent) {
    setTimeout(() => {
      closedSocket.connect();
    }, 1000);
  }
}
