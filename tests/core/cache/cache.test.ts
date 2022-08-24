import { InMemoryCache } from '../../../src/core';
import { wait } from '../../../src/utils';
import { absoluteExpirationTestCases, slidingExpirationTestCases } from './testCases';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  afterEach(() => {
    cache?.clear();
  });

  test.each(absoluteExpirationTestCases)(
    'sets and returns values with absolute expiration (%s)',
    async (_, [defaultSetOptions, setOptions, cacheLiveTime]) => {
      cache = new InMemoryCache(defaultSetOptions);
      const key = 'key1';
      const value = 'someValue';

      cache.set(key, value, setOptions);
      const returnedValue = cache.get(key);
      expect(returnedValue).toEqual(value);

      await wait(cacheLiveTime / 2);
      cache.get(key);
      await wait((cacheLiveTime / 2) + 100);

      const cleanedValue = cache.get(key);
      expect(cleanedValue).toBeUndefined();
    }
  );

  test.each(slidingExpirationTestCases)(
    'sets and returns values with sliding expiration (%s)',
    async (_, [defaultSetOptions, setOptions, cacheLiveTime]) => {
      cache = new InMemoryCache(defaultSetOptions);
      const key = 'key1';
      const value = 'someValue';

      cache.set(key, value, setOptions);
      const returnedValue = cache.get(key);
      expect(returnedValue).toEqual(value);

      await wait(cacheLiveTime / 2);
      cache.get(key);
      await wait(cacheLiveTime / 2);

      const stillStoredValue = cache.get(key);
      expect(stillStoredValue).toEqual(value);

      await wait(cacheLiveTime);

      const cleanedValue = cache.get(key);
      expect(cleanedValue).toBeUndefined();
    }
  );

  test('deletes entries', () => {
    cache = new InMemoryCache({ absoluteExpirationMs: 1000 * 60 * 5 });
    const keyToRemove = 'keyToRemove';
    const valueToRemove = 'valueToRemove';
    const keyToStore = 'keyToStore';
    const valueToStore = 'valueToStore';

    cache.set(keyToRemove, valueToRemove);
    cache.set(keyToStore, valueToStore);

    cache.delete(keyToRemove);

    const removedValue = cache.get(keyToRemove);
    expect(removedValue).toBeUndefined();

    const stillStoredValue = cache.get(keyToStore);
    expect(stillStoredValue).toEqual(valueToStore);
  });

  test('clears all entries', () => {
    cache = new InMemoryCache({ absoluteExpirationMs: 1000 * 60 * 5 });
    const entries: Array<[key: string, value: string]> = [
      ['key1', 'value1'],
      ['key2', 'value2']
    ];

    entries.forEach(([key, value]) => {
      cache.set(key, value);
    });

    cache.clear();

    entries.forEach(([key]) => {
      const removedValue = cache.get(key);
      expect(removedValue).toBeUndefined();
    });
  });
});
