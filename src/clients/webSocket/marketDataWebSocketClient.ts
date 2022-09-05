import { EventEmitter, TimeoutScheduler } from '../../core/index';
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

  private _isStarted = false;
  protected reconnectScheduler = new TimeoutScheduler([1000, 5000, 30000, 60000], 60000);

  constructor(
    protected readonly webSocketApiBaseUrl: string
  ) {
    this.socket = new WebSocketClient(new URL(MarketDataWebSocketClient.MARKET_DATA_URL_PATH, this.webSocketApiBaseUrl));
  }

  get isStarted() {
    return this._isStarted;
  }

  async start(): Promise<void> {
    if (this.isStarted)
      return;

    this.socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.socket.events.closed.addListener(this.onSocketClosed);
    await this.socket.connect();

    this.subscribeOnStreams(this.socket);

    this._isStarted = true;
  }

  stop() {
    if (!this.isStarted)
      return;

    this.socket.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.socket.events.closed.removeListener(this.onSocketClosed);
    this.socket.disconnect();
    this.reconnectScheduler.dispose();

    this._isStarted = false;
  }

  protected subscribeOnStreams(socket: WebSocketClient) {
    socket.subscribe(MarketDataWebSocketClient.TOP_OF_BOOK_STREAM);
    socket.subscribe(MarketDataWebSocketClient.ORDER_BOOK_STREAM);
  }

  protected onSocketClosed = (socket: WebSocketClient, _event: CloseEvent) => {
    this.reconnectScheduler.setTimeout(async () => {
      await socket.connect();
      this.subscribeOnStreams(socket);
    });
  };

  protected onSocketMessageReceived = (message: WebSocketResponseDto) => {
    this.events.messageReceived.emit(message);
  };
}
