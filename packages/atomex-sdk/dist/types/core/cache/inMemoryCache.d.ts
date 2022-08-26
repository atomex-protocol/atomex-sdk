import type { Cache, SetCacheOptions } from './cache';
export declare class InMemoryCache<K = string> implements Cache<K> {
    private readonly defaultCacheOptions;
    private static readonly defaultCacheOptions;
    private readonly cacheMap;
    constructor(defaultCacheOptions?: SetCacheOptions);
    get<T = unknown>(key: K): T | undefined;
    set(key: K, value: unknown, options?: SetCacheOptions): void;
    delete(key: K): void;
    clear(): void;
    dispose(): Promise<void>;
    private getTimeoutAndIsSlidingExpiration;
}
