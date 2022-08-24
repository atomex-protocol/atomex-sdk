import { InMemoryCache } from '../../../src/core';
import { wait } from '../../../src/utils';
import { absoluteExpirationTestCases, slidingExpirationTestCases } from './testCases';

describe('InMemoryCache', () => {
  test.each(absoluteExpirationTestCases)(
    'sets and returns values with absolute expiration (%s)',
    async (_, [defaultSetOptions, setOptions, cacheLiveTime]) => {
      const cache = new InMemoryCache(defaultSetOptions);
      const key = 'key1';
      const value = 'someValue';

      cache.set(key, value, setOptions);
      const returnedValue = cache.get(key);
      expect(returnedValue).toEqual(value);

      await wait(cacheLiveTime / 2);
      cache.get(key);
      await wait(cacheLiveTime / 2);

      const cleanedValue = cache.get(key);
      expect(cleanedValue).toBeUndefined();
    }
  );

  test.each(slidingExpirationTestCases)(
    'sets and returns values with sliding expiration (%s)',
    async (_, [defaultSetOptions, setOptions, cacheLiveTime]) => {
      const cache = new InMemoryCache(defaultSetOptions);
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
});
