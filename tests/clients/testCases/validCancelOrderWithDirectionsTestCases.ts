import BigNumber from 'bignumber.js';

import type { CancelOrderRequest, ExchangeSymbol } from '../../../src/exchange/index';

const validCancelOrderWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [exchangeSymbols: ExchangeSymbol[], request: CancelOrderRequest, expectedSymbol: string, expectedFilterValue: string]
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
          orderId: 1,
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
          orderId: 1,
          from: 'XTZ',
          to: 'ETH'
        },
        'XTZ/ETH',
        'Sell'
      ]
    ]
  ];

export default validCancelOrderWithDirectionsTestCases;
