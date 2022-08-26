import { EventEmitter } from '../../core/index';
import type { WebSocketRequestDto, WebSocketResponseDto } from '../dtos';

export interface WebSocketClientEvents {
  messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
  closed: EventEmitter<readonly [socket: WebSocketClient, event: CloseEvent]>;
}

export class WebSocketClient {
  readonly events: WebSocketClientEvents = {
    messageReceived: new EventEmitter(),
    closed: new EventEmitter()
  };

  protected _socket: WebSocket | undefined;

  protected get socket(): WebSocket {
    if (!this._socket)
      throw new Error('Internal websocket is not created. Use the connect method first');

    return this._socket;
  }

  constructor(
    protected readonly url: string | URL,
    protected readonly authToken?: string,
  ) {
  }

  async connect(): Promise<void> {
    this.disconnect();
    return new Promise(resolve => {
      const protocols = this.authToken ? ['access_token', this.authToken] : undefined;
      this._socket = new WebSocket(this.url, protocols);
      this.socket.addEventListener('message', this.onMessageReceived);
      this.socket.addEventListener('error', this.onError);
      this.socket.addEventListener('close', this.onClosed);

      this.socket.addEventListener('open', () => resolve());
    });
  }

  disconnect() {
    if (this._socket) {
      this.socket.removeEventListener('message', this.onMessageReceived);
      this.socket.removeEventListener('error', this.onError);
      this.socket.removeEventListener('close', this.onClosed);
      this.socket.close();
    }
  }

  subscribe(stream: string) {
    const message: WebSocketRequestDto = {
      method: 'subscribe',
      data: stream,
      requestId: Date.now()
    };

    this.socket.send(JSON.stringify(message));
  }

  unsubscribe(stream: string) {
    const message: WebSocketRequestDto = {
      method: 'unsubscribe',
      data: stream,
      requestId: Date.now()
    };

    this.socket.send(JSON.stringify(message));
  }

  protected onMessageReceived = (event: MessageEvent<string>) => {
    this.events.messageReceived.emit(JSON.parse(event.data));
  };

  protected onError(event: Event) {
    throw new Error(`Websocket received error: ${JSON.stringify(event)}`);
  }

  protected onClosed = (event: CloseEvent) => {
    this.events.closed.emit(this, event);
  };
}
