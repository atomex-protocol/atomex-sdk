import BigNumber from 'bignumber.js';

import type { FeesInfo } from '../../../../src/blockchain';

const redeemRewardNativeCurrencyTestCases: ReadonlyArray<[
  message: string,
  data: {
    currencyId: string;
    prices: Record<string, BigNumber>;
    redeemFee: FeesInfo;
    expectedRedeemReward: FeesInfo;
  }
]> = [
    [
      'Simple (XTZ)',
      {
        prices: {
          'XTZ/USD': new BigNumber('2.15')
        },
        currencyId: 'XTZ',
        redeemFee: {
          estimated: new BigNumber('0.011'),
          max: new BigNumber('999')
        },
        expectedRedeemReward: {
          estimated: new BigNumber('0.021979139924875144'),
          max: new BigNumber('0.021979139924875144')
        }
      }
    ],
  ];

export default redeemRewardNativeCurrencyTestCases;
