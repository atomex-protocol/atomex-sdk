import type { Disposable } from '../../common/index';

export type SetCacheOptions = {
  absoluteExpirationMs: number;
  slidingExpirationMs?: never;
} | {
  absoluteExpirationMs?: never;
  slidingExpirationMs: number;
};

export interface Cache<K = string> extends Disposable {
  get<T = unknown>(key: K): T | undefined;
  set(key: K, value: unknown, options?: SetCacheOptions): void;
  delete(key: K): void;
  clear(): void;
}
