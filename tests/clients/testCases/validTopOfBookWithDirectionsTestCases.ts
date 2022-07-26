import BigNumber from 'bignumber.js';

import { QuoteDto, SymbolDto } from '../../../src/clients/dtos';
import { CurrencyDirection, Quote } from '../../../src/exchange/index';

const validTopOfBookWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [
    symbolDtos: SymbolDto[],
    quoteDtos: QuoteDto[],
    directions: CurrencyDirection[],
    quotes: Quote[],
    expectedSymbolsInFilter: string]
]> = [
    [
      'Simple quotes',
      [
        [
          {
            name: 'ETH/BTC',
            minimumQty: 0.0001
          },
          {
            name: 'LTC/BTC',
            minimumQty: 0.0001
          }
        ],
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
          { from: 'ETH', to: 'BTC' },
          { from: 'BTC', to: 'LTC' },
        ],
        [
          {
            symbol: 'ETH/BTC',
            timeStamp: new Date(1658231388786),
            bid: new BigNumber(0.06976116),
            ask: new BigNumber(0.07041282),
            quoteCurrency: 'ETH',
            baseCurrency: 'BTC'
          },
          {
            symbol: 'LTC/BTC',
            timeStamp: new Date(1658315396688),
            bid: new BigNumber(0.00244486),
            ask: new BigNumber(0),
            quoteCurrency: 'LTC',
            baseCurrency: 'BTC'
          }
        ],
        'ETH/BTC,LTC/BTC'
      ]
    ]
  ];

export default validTopOfBookWithDirectionsTestCases;
