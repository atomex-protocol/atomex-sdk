import { EventEmitter } from '../../core/index';
import type { WebSocketResponseDto } from '../dtos';
import { WebSocketClient } from './webSocketClient';

export interface MarketDataWebSocketClientEvents {
  messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}

export class MarketDataWebSocketClient {
  protected static readonly MARKET_DATA_URL_PATH = '/ws/marketdata';
  protected static readonly TOP_OF_BOOK_STREAM = 'topOfBook';
  protected static readonly ORDER_BOOK_STREAM = 'orderBook';

  readonly events: MarketDataWebSocketClientEvents = {
    messageReceived: new EventEmitter()
  };

  protected socket: WebSocketClient;

  constructor(
    protected readonly webSocketApiBaseUrl: string
  ) {
    this.onSocketMessageReceived = this.onSocketMessageReceived.bind(this);
    this.onSocketClosed = this.onSocketClosed.bind(this);

    this.socket = this.createWebSocket();
  }

  dispose() {
    this.socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.socket.events.closed.removeListener(this.onSocketClosed);
    this.socket.disconnect();
  }

  protected createWebSocket(): WebSocketClient {
    const socket = new WebSocketClient(new URL(MarketDataWebSocketClient.MARKET_DATA_URL_PATH, this.webSocketApiBaseUrl));
    socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    socket.events.closed.addListener(this.onSocketClosed);
    socket.connect();

    this.subscribeOnStreams(socket);

    return socket;
  }

  protected subscribeOnStreams(socket: WebSocketClient) {
    socket.subscribe(MarketDataWebSocketClient.TOP_OF_BOOK_STREAM);
    socket.subscribe(MarketDataWebSocketClient.ORDER_BOOK_STREAM);
  }

  protected onSocketClosed(socket: WebSocketClient, _event: CloseEvent) {
    setTimeout(() => {
      socket.connect();
      this.subscribeOnStreams(socket);
    }, 1000);
  }

  protected onSocketMessageReceived(message: WebSocketResponseDto) {
    this.events.messageReceived.emit(message);
  }
}
