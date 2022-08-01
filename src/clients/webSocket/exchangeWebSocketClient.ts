import type { AuthorizationManager, AuthToken } from '../../authorization/index';
import { EventEmitter } from '../../core/index';
import type { WebSocketResponseDto } from '../dtos';
import { WebSocketClient } from './webSocketClient';

export interface ExchangeWebSocketClientEvents {
  messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}

export class ExchangeWebSocketClient {
  protected static readonly EXCHANGE_URL_PATH = '/ws/exchange';

  readonly events: ExchangeWebSocketClientEvents = {
    messageReceived: new EventEmitter()
  };

  protected readonly sockets: Map<string, WebSocketClient> = new Map();

  constructor(
    protected readonly webSocketApiBaseUrl: string,
    protected readonly authorizationManager: AuthorizationManager
  ) {
    this.onAuthorized = this.onAuthorized.bind(this);
    this.onUnauthorized = this.onUnauthorized.bind(this);
    this.onSocketMessageReceived = this.onSocketMessageReceived.bind(this);
    this.onClosed = this.onClosed.bind(this);

    this.subscribeOnAuthEvents();
  }

  dispose() {
    this.sockets.forEach((_, userId) => {
      this.removeSocket(userId);
    });
  }

  protected subscribeOnAuthEvents() {
    this.authorizationManager.events.authorized.addListener(this.onAuthorized);
    this.authorizationManager.events.unauthorized.addListener(this.onUnauthorized);
  }

  protected onAuthorized(authToken: AuthToken) {
    this.removeSocket(authToken.userId);

    const socket = new WebSocketClient(new URL(ExchangeWebSocketClient.EXCHANGE_URL_PATH, this.webSocketApiBaseUrl), authToken.value);
    socket.events.messageReceived.addListener(this.onSocketMessageReceived);
    socket.events.closed.addListener(this.onClosed);

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
      socket.events.closed.removeListener(this.onClosed);
      this.sockets.delete(userId);
      socket.disconnect();
    }
  }

  protected onSocketMessageReceived(message: WebSocketResponseDto) {
    this.events.messageReceived.emit(message);
  }

  protected onClosed(socket: WebSocketClient, _event: CloseEvent) {
    setTimeout(() => {
      socket.connect();
    }, 1000);
  }
}
