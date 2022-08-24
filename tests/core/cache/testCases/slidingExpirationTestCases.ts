import type { SetCacheOptions } from '../../../../src/core';

const absoluteExpirationTestCases: ReadonlyArray<[
  message: string,
  testData: readonly [defaultSetOptions: SetCacheOptions | undefined, setOptions: SetCacheOptions | undefined, cacheLiveTime: number]
]> = [
    [
      'default options',
      [
        { slidingExpirationMs: 1000 },
        undefined,
        1000
      ]
    ],
    [
      'actual options',
      [
        undefined,
        { slidingExpirationMs: 1000 },
        1000
      ]
    ],
    [
      'actual with overridden default options',
      [
        { slidingExpirationMs: 3000 },
        { slidingExpirationMs: 1000 },
        1000
      ]
    ]
  ];


export default absoluteExpirationTestCases;
