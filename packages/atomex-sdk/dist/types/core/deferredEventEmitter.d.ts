import { PublicEventEmitter } from './eventEmitter';
export declare class DeferredEventEmitter<K, T extends readonly unknown[]> implements PublicEventEmitter<T> {
    private readonly latencyMs;
    private readonly watcherIdsMap;
    private readonly internalEmitter;
    constructor(latencyMs?: number);
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
    emit(key: K, ...args: T): void;
}
export declare type ToDeferredEventEmitter<K, T> = T extends PublicEventEmitter<infer TArgs> ? DeferredEventEmitter<K, TArgs> : never;
export declare type ToDeferredEventEmitters<K, T> = T extends Record<infer P, PublicEventEmitter<infer TArgs>> ? Record<P, DeferredEventEmitter<K, TArgs>> : never;
