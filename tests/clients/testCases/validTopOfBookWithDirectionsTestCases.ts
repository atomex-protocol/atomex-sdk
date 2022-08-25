import BigNumber from 'bignumber.js';

import type { QuoteDto } from '../../../src/clients/dtos';
import type { CurrencyDirection, ExchangeSymbol, Quote } from '../../../src/exchange/index';

const validTopOfBookWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [
    exchangeSymbols: ExchangeSymbol[],
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
            baseCurrency: 'ETH',
            quoteCurrency: 'BTC',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              baseCurrency: 9,
              quoteCurrency: 8,
              price: 9
            }
          },
          {
            name: 'LTC/BTC',
            baseCurrency: 'LTC',
            quoteCurrency: 'BTC',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              baseCurrency: 9,
              quoteCurrency: 8,
              price: 9
            }
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
        ],
        'ETH/BTC,LTC/BTC'
      ]
    ]
  ];

export default validTopOfBookWithDirectionsTestCases;
