import { EventEmitter, PublicEventEmitter } from './eventEmitter';

export class DeferredEventEmitter<K, T extends readonly unknown[]> implements PublicEventEmitter<T> {
  private readonly watcherIdsMap: Map<K, ReturnType<typeof setTimeout>> = new Map();
  private readonly internalEmitter = new EventEmitter<T>();

  constructor(
    private readonly latencyMs: number = 1000
  ) { }

  addListener(listener: (...args: T) => void) {
    this.internalEmitter.addListener(listener);
    return this;
  }

  removeListener(listener: (...args: T) => void) {
    this.internalEmitter.removeListener(listener);
    return this;
  }

  removeAllListeners() {
    this.internalEmitter.removeAllListeners();
    return this;
  }

  emit(key: K, ...args: T) {
    const oldWatcherId = this.watcherIdsMap.get(key);
    if (oldWatcherId)
      clearTimeout(oldWatcherId);

    const watcherId = setTimeout(() => {
      this.watcherIdsMap.delete(key);
      this.internalEmitter.emit(...args);
    }, this.latencyMs);

    this.watcherIdsMap.set(key, watcherId);
  }
}

export type ToDeferredEventEmitter<K, T> = T extends PublicEventEmitter<infer TArgs> ? DeferredEventEmitter<K, TArgs> : never;
export type ToDeferredEventEmitters<K, T> = T extends Record<infer P, PublicEventEmitter<infer TArgs>> ? Record<P, DeferredEventEmitter<K, TArgs>> : never;
