import { EventEmitter } from '../../core/index';
import type { WebSocketResponseDto } from '../dtos';
import { WebSocketClient } from './webSocketClient';

export interface MarketDataWebSocketManagerEvents {
  messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}

export class MarketDataWebSocketManager {
  static readonly MARKET_DATA_URL_PATH = '/ws/marketdata';
  static readonly TOP_OF_BOOK_STREAM = 'topOfBook';
  static readonly ORDER_BOOK_STREAM = 'orderBook';

  readonly events: MarketDataWebSocketManagerEvents = {
    messageReceived: new EventEmitter()
  };

  protected socket: WebSocketClient;

  constructor(
    protected readonly webSocketApiBaseUrl: string
  ) {
    this.onSocketClosed = this.onSocketClosed.bind(this);

    this.socket = this.createWebSocket();
  }

  dispose() {
    this.socket.events.closed.removeListener(this.onSocketClosed);
    this.socket.disconnect();
  }

  protected createWebSocket(): WebSocketClient {
    const socket = new WebSocketClient(new URL(MarketDataWebSocketManager.MARKET_DATA_URL_PATH, this.webSocketApiBaseUrl));
    socket.events.closed.addListener(this.onSocketClosed);
    socket.connect();

    this.subscribeOnStreams(socket);

    return socket;
  }

  protected subscribeOnStreams(socket: WebSocketClient) {
    socket.subscribe(MarketDataWebSocketManager.TOP_OF_BOOK_STREAM);
    socket.subscribe(MarketDataWebSocketManager.ORDER_BOOK_STREAM);
  }

  protected onSocketClosed(socket: WebSocketClient, _event: CloseEvent) {
    setTimeout(() => {
      socket.connect();
      this.subscribeOnStreams(socket);
    }, 1000);
  }
}
