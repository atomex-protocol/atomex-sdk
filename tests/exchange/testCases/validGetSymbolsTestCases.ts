import BigNumber from 'bignumber.js';

import type { ExchangeSymbol } from '../../../src/exchange/index';

const validGetSymbolsTestCases: ReadonlyArray<[
  message: string,
  symbolUpdates: readonly ExchangeSymbol[][]
]> = [
    [
      'Symbols with one update',
      [
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'BTC',
            quoteCurrency: 'ETH',
            minimumQty: new BigNumber(0.001),
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 9,
              price: 9
            }
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            quoteCurrency: 'XTZ',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              baseCurrency: 9,
              quoteCurrency: 6,
              price: 9
            }
          }
        ]
      ]
    ],
    [
      'Symbols with two updates',
      [
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'BTC',
            quoteCurrency: 'ETH',
            minimumQty: new BigNumber(0.001),
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 9,
              price: 9
            }
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            quoteCurrency: 'XTZ',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              baseCurrency: 9,
              quoteCurrency: 6,
              price: 9
            }
          }
        ],
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'BTC',
            quoteCurrency: 'ETH',
            minimumQty: new BigNumber(0.001),
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 9,
              price: 9
            }
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            quoteCurrency: 'XTZ',
            minimumQty: new BigNumber(0.01),
            decimals: {
              baseCurrency: 4,
              quoteCurrency: 2,
              price: 3
            }
          }
        ]
      ],
    ]
  ];

export default validGetSymbolsTestCases;
