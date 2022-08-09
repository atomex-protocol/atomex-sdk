import { EventEmitter } from '../../core/eventEmitter';
import type { WebSocketResponseDto } from '../dtos';
export interface WebSocketClientEvents {
    messageReceived: EventEmitter<readonly [message: WebSocketResponseDto]>;
    closed: EventEmitter<readonly [socket: WebSocketClient, event: CloseEvent]>;
}
export declare class WebSocketClient {
    protected readonly url: string | URL;
    protected readonly authToken?: string | undefined;
    readonly events: WebSocketClientEvents;
    protected _socket: WebSocket | undefined;
    protected get socket(): WebSocket;
    constructor(url: string | URL, authToken?: string | undefined);
    connect(): Promise<void>;
    disconnect(): void;
    subscribe(stream: string): void;
    unsubscribe(stream: string): void;
    protected onMessageReceived: (event: MessageEvent<string>) => void;
    protected onError(event: Event): void;
    protected onClosed: (event: CloseEvent) => void;
}
