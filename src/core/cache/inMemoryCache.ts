import type { Cache, SetCacheOptions } from './cache';

interface CacheEntry {
  value: unknown;
  watcherId: ReturnType<typeof setTimeout>;
  options: SetCacheOptions;
}

export class InMemoryCache<K = string> implements Cache<K> {
  private static readonly defaultCacheOptions: SetCacheOptions = {
    absoluteExpirationMs: 1000 * 60 * 30,
  };

  private readonly cacheMap: Map<K, CacheEntry> = new Map();

  constructor(
    private readonly defaultCacheOptions: SetCacheOptions = InMemoryCache.defaultCacheOptions
  ) { }

  get<T = unknown>(key: K): T | undefined {
    const entry = this.cacheMap.get(key);
    if (!entry)
      return undefined;

    const isSlidingExpiration = this.getTimeoutAndIsSlidingExpiration(entry.options)[1];
    if (isSlidingExpiration)
      this.set(key, entry.value, entry.options);

    return entry.value as T | undefined;
  }

  set(key: K, value: unknown, options = this.defaultCacheOptions): void {
    this.delete(key);

    const [timeout] = this.getTimeoutAndIsSlidingExpiration(options);
    const watcherId = setTimeout(() => {
      this.cacheMap.delete(key);
    }, timeout);

    const entry: CacheEntry = { value, watcherId, options };
    this.cacheMap.set(key, entry);
  }

  delete(key: K): void {
    const oldEntry = this.cacheMap.get(key);
    if (!oldEntry)
      return;

    clearTimeout(oldEntry.watcherId);
    this.cacheMap.delete(key);
  }

  clear(): void {
    const keys = [...this.cacheMap.keys()];
    keys.forEach(key => this.delete(key));
  }

  private getTimeoutAndIsSlidingExpiration(options: SetCacheOptions): [timeout: number, isSlidingExpiration: boolean] {
    return options.slidingExpirationMs !== undefined
      ? [options.slidingExpirationMs, true]
      : [options.absoluteExpirationMs, false];
  }
}
