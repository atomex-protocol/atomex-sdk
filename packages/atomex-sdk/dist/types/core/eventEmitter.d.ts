export interface PublicEventEmitter<T extends readonly unknown[]> {
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
}
export declare class EventEmitter<T extends readonly unknown[]> implements PublicEventEmitter<T> {
    private listeners;
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
    emit(...args: T): void;
}
export declare type ToEventEmitter<T> = T extends PublicEventEmitter<infer TArgs> ? EventEmitter<TArgs> : never;
export declare type ToEventEmitters<T> = T extends Record<infer K, PublicEventEmitter<infer TArgs>> ? Record<K, EventEmitter<TArgs>> : never;
