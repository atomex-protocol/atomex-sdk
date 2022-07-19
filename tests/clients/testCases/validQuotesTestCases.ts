import BigNumber from 'bignumber.js';

import { QuoteDto } from '../../../src/clients/dtos';
import { Quote } from '../../../src/exchange/index';

const validQuotesTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dtos: QuoteDto[], quotes: Quote[]]
]> = [
    [
      'Simple quotes',
      [
        [
          {
            symbol: 'ETH/BTC',
            timeStamp: 1658231388786,
            bid: 0.06976116,
            ask: 0.07041282
          }
        ],
        [
          {
            symbol: 'ETH/BTC',
            timeStamp: new Date(1658231388786),
            bid: new BigNumber(0.06976116),
            ask: new BigNumber(0.07041282),
            quoteCurrency: '',
            baseCurrency: ''
          }
        ]
      ]
    ]
  ];

export default validQuotesTestCases;
