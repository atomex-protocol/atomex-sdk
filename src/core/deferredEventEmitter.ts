import { EventEmitter, PublicEventEmitter } from './eventEmitter';

export class DeferredEventEmitter<K, T extends readonly unknown[]> extends EventEmitter<T> {
  private readonly watchersMap: Map<K, ReturnType<typeof setTimeout>> = new Map();

  constructor(
    private readonly latencyMs: number = 1000
  ) {
    super();
  }

  emitDeferred(key: K, ...args: T) {
    const oldWatcherId = this.watchersMap.get(key);
    if (oldWatcherId)
      clearTimeout(oldWatcherId);

    const watcherId = setTimeout(() => {
      super.emit(...args);
    }, this.latencyMs);

    this.watchersMap.set(key, watcherId);
  }
}

export type ToDeferredEventEmitter<K, T> = T extends PublicEventEmitter<infer TArgs> ? DeferredEventEmitter<K, TArgs> : never;
export type ToDeferredEventEmitters<K, T> = T extends Record<infer P, PublicEventEmitter<infer TArgs>> ? Record<P, DeferredEventEmitter<K, TArgs>> : never;
