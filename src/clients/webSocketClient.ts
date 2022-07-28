import { EventEmitter } from '../core/eventEmitter';
import type { WebSocketRequestDto, WebSocketResponseDto } from './dtos';

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

  protected set socket(value: WebSocket) {
    this._socket = value;
  }

  constructor(
    protected readonly url: string | URL,
    protected readonly authToken: string,
  ) {
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onClosed = this.onClosed.bind(this);
  }

  connect() {
    if (this._socket)
      this.disconnect();

    this.socket = new WebSocket(this.url, ['access_token', this.authToken]);
    this.socket.addEventListener('message', this.onMessageReceived);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('close', this.onClosed);
  }

  disconnect() {
    this.socket.removeEventListener('message', this.onMessageReceived);
    this.socket.removeEventListener('error', this.onError);
    this.socket.removeEventListener('close', this.onClosed);
    this.socket.close();
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

  protected onMessageReceived(event: MessageEvent<string>) {
    this.events.messageReceived.emit(JSON.parse(event.data));
  }

  protected onError(event: Event) {
    throw new Error(`Websocket received error: ${JSON.stringify(event)}`);
  }

  protected onClosed(event: CloseEvent) {
    this.events.closed.emit(this, event);
  }
}
