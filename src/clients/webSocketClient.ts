import { EventEmitter } from '../core/eventEmitter';
import { WebSocketRequestDto, WebSocketResponseDto } from './dtos';

export interface WebSocketClientEvents {
  messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}

export class WebSocketClient {
  readonly events: WebSocketClientEvents = {
    messageReceived: new EventEmitter(),
  };

  private _socket: WebSocket | undefined;

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
  }

  connect() {
    this.socket = new WebSocket(this.url, ['access_token', this.authToken]);
    this.socket.addEventListener('message', this.onMessageReceived);
  }

  disconnect() {
    this.socket.removeEventListener('message', this.onMessageReceived);
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
}
