import type { AuthorizationManager, AuthToken } from '../../authorization/index';
import { EventEmitter } from '../../core/index';
import type { WebSocketResponseDto } from '../dtos';
import { WebSocketClient } from './webSocketClient';
export interface ExchangeWebSocketClientEvents {
    messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}
export declare class ExchangeWebSocketClient {
    protected readonly webSocketApiBaseUrl: string;
    protected readonly authorizationManager: AuthorizationManager;
    protected static readonly EXCHANGE_URL_PATH = "/ws/exchange";
    readonly events: ExchangeWebSocketClientEvents;
    protected readonly sockets: Map<string, WebSocketClient>;
    private _isStarted;
    constructor(webSocketApiBaseUrl: string, authorizationManager: AuthorizationManager);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    protected subscribeOnAuthEvents(): void;
    protected onAuthorized: (authToken: AuthToken) => Promise<void>;
    protected onUnauthorized: (authToken: AuthToken) => void;
    protected removeSocket(userId: string): void;
    protected onSocketMessageReceived: (message: WebSocketResponseDto) => void;
    protected onClosed: (socket: WebSocketClient, _event: CloseEvent) => void;
}
