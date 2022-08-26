import type { SetCacheOptions } from '../../../../src/core';

const absoluteExpirationTestCases: ReadonlyArray<[
  message: string,
  testData: readonly [defaultSetOptions: SetCacheOptions | undefined, setOptions: SetCacheOptions | undefined, cacheLiveTime: number]
]> = [
    [
      'default options',
      [
        { absoluteExpirationMs: 1000 },
        undefined,
        1000
      ]
    ],
    [
      'actual options',
      [
        undefined,
        { absoluteExpirationMs: 1000 },
        1000
      ]
    ],
    [
      'actual with overridden default options',
      [
        { absoluteExpirationMs: 3000 },
        { absoluteExpirationMs: 1000 },
        1000
      ]
    ]
  ];


export default absoluteExpirationTestCases;
