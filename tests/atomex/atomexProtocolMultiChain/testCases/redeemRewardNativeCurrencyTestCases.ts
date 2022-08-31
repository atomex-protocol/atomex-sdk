import BigNumber from 'bignumber.js';

import type { FeesInfo } from '../../../../src/blockchain/index';
import type { Currency } from '../../../../src/common/index';

const redeemRewardNativeCurrencyTestCases: ReadonlyArray<[
  message: string,
  data: {
    currencyId: string;
    currencies: Record<string, Currency>;
    prices: Record<string, BigNumber>;
    redeemFee: FeesInfo;
    expectedRedeemReward: FeesInfo;
  }
]> = [
    [
      'Simple (XTZ)',
      {
        currencies: {
          XTZ: {
            id: 'XTZ',
            name: 'Tezos',
            symbol: 'XTZ',
            blockchain: 'tezos',
            type: 'native',
            decimals: 6
          }
        },
        prices: {
          'XTZ/USD': new BigNumber('2.15')
        },
        currencyId: 'XTZ',
        redeemFee: {
          estimated: new BigNumber('0.011'),
          max: new BigNumber('999')
        },
        expectedRedeemReward: {
          estimated: new BigNumber('0.021979'),
          max: new BigNumber('0.021979')
        }
      }
    ],
    [
      'Simple (XTZ) if it has decimals equals 12',
      {
        currencies: {
          XTZ: {
            id: 'XTZ',
            name: 'Tezos',
            symbol: 'XTZ',
            blockchain: 'tezos',
            type: 'native',
            decimals: 12
          }
        },
        prices: {
          'XTZ/USD': new BigNumber('2.15')
        },
        currencyId: 'XTZ',
        redeemFee: {
          estimated: new BigNumber('0.011'),
          max: new BigNumber('999')
        },
        expectedRedeemReward: {
          estimated: new BigNumber('0.021979139'),
          max: new BigNumber('0.021979139')
        }
      }
    ],
  ];

export default redeemRewardNativeCurrencyTestCases;
