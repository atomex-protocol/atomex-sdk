import BigNumber from 'bignumber.js';

import type { QuoteDto } from '../../../src/clients/dtos';
import type { Quote } from '../../../src/exchange/index';

const validTopOfBookTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dtos: QuoteDto[], quotes: Quote[]]
]> = [
    [
      'Empty result',
      [
        [],
        []
      ]
    ],
    [
      'Simple quotes',
      [
        [
          {
            symbol: 'ETH/BTC',
            timeStamp: 1658231388786,
            bid: 0.06976116,
            ask: 0.07041282
          },
          {
            symbol: 'LTC/BTC',
            timeStamp: 1658315396688,
            bid: 0.00244486,
            ask: 0
          },
        ],
        [
          {
            symbol: 'ETH/BTC',
            timeStamp: new Date(1658231388786),
            bid: new BigNumber(0.06976116),
            ask: new BigNumber(0.07041282),
            baseCurrency: 'ETH',
            quoteCurrency: 'BTC'
          },
          {
            symbol: 'LTC/BTC',
            timeStamp: new Date(1658315396688),
            bid: new BigNumber(0.00244486),
            ask: new BigNumber(0),
            baseCurrency: 'LTC',
            quoteCurrency: 'BTC'
          }
        ]
      ]
    ]
  ];

export default validTopOfBookTestCases;
