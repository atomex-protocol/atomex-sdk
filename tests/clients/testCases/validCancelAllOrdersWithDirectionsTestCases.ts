import BigNumber from 'bignumber.js';

import type { CancelAllSide } from '../../../src/common/index';
import type { CancelAllOrdersRequest, ExchangeSymbol } from '../../../src/exchange/index';

const validCancelAllOrdersWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [symbolDto: ExchangeSymbol[], request: CancelAllOrdersRequest, expectedSymbol: string, expectedFilterValue: CancelAllSide]
]> = [
    [
      'Buy case',
      [
        [{
          name: 'XTZ/ETH',
          baseCurrency: 'ETH',
          baseCurrencyDecimals: 18,
          quoteCurrency: 'XTZ',
          quoteCurrencyDecimals: 6,
          minimumQty: new BigNumber(1)
        }],
        {
          from: 'ETH',
          to: 'XTZ'
        },
        'XTZ/ETH',
        'Buy'
      ]
    ],
    [
      'Sell case',
      [
        [{
          name: 'XTZ/ETH',
          baseCurrency: 'ETH',
          baseCurrencyDecimals: 18,
          quoteCurrency: 'XTZ',
          quoteCurrencyDecimals: 6,
          minimumQty: new BigNumber(1)
        }],
        {
          from: 'XTZ',
          to: 'ETH'
        },
        'XTZ/ETH',
        'Sell'
      ]
    ],
    [
      'All sides case',
      [
        [{
          name: 'XTZ/ETH',
          baseCurrency: 'ETH',
          baseCurrencyDecimals: 18,
          quoteCurrency: 'XTZ',
          quoteCurrencyDecimals: 6,
          minimumQty: new BigNumber(1)
        }],
        {
          from: 'XTZ',
          to: 'ETH',
          cancelAllDirections: true
        },
        'XTZ/ETH',
        'All'
      ]
    ]
  ];

export default validCancelAllOrdersWithDirectionsTestCases;
