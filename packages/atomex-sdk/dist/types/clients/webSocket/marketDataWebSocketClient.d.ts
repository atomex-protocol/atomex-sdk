import { EventEmitter, TimeoutScheduler } from '../../core/index';
import type { WebSocketResponseDto } from '../dtos';
import { WebSocketClient } from './webSocketClient';
export interface MarketDataWebSocketClientEvents {
    messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
}
export declare class MarketDataWebSocketClient {
    protected readonly webSocketApiBaseUrl: string;
    protected static readonly MARKET_DATA_URL_PATH = "/ws/marketdata";
    protected static readonly TOP_OF_BOOK_STREAM = "topOfBook";
    protected static readonly ORDER_BOOK_STREAM = "orderBook";
    readonly events: MarketDataWebSocketClientEvents;
    protected socket: WebSocketClient;
    private _isStarted;
    protected reconnectScheduler: TimeoutScheduler;
    constructor(webSocketApiBaseUrl: string);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    protected subscribeOnStreams(socket: WebSocketClient): void;
    protected onSocketClosed: (socket: WebSocketClient, _event: CloseEvent) => void;
    protected onSocketMessageReceived: (message: WebSocketResponseDto) => void;
}
