import BigNumber from 'bignumber.js';

import type { FeesInfo } from '../../../../src/blockchain/index';
import type { Currency } from '../../../../src/common/index';

const redeemRewardTokenTestCases: ReadonlyArray<[
  message: string,
  data: {
    currencyId: string;
    nativeCurrencyId: string;
    currencies: Record<string, Currency>;
    prices: Record<string, BigNumber>;
    redeemFee: FeesInfo;
    expectedRedeemReward: FeesInfo;
  }
]> = [
    [
      'Simple (TZBTC)',
      {
        currencies: {
          TZBTC: {
            id: 'TZBTC',
            name: 'Tezos BTC',
            symbol: 'TZBTC',
            blockchain: 'tezos',
            type: 'fa1.2',
            decimals: 6
          },
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
          'XTZ/USD': new BigNumber('2.15'),
          'XTZ/TZBTC': new BigNumber('0.00006994')
        },
        currencyId: 'TZBTC',
        nativeCurrencyId: 'XTZ',
        redeemFee: {
          estimated: new BigNumber('0.011'),
          max: new BigNumber('999')
        },
        expectedRedeemReward: {
          estimated: new BigNumber('0.00000153722104634576757136'),
          max: new BigNumber('0.00000153722104634576757136')
        }
      }
    ],
  ];

export default redeemRewardTokenTestCases;
