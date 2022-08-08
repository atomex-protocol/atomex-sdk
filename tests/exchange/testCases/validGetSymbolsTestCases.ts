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
            baseCurrencyDecimals: 8,
            quoteCurrency: 'ETH',
            quoteCurrencyDecimals: 9,
            minimumQty: new BigNumber(0.001)
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            baseCurrencyDecimals: 9,
            quoteCurrency: 'XTZ',
            quoteCurrencyDecimals: 6,
            minimumQty: new BigNumber(0.0001)
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
            baseCurrencyDecimals: 8,
            quoteCurrency: 'ETH',
            quoteCurrencyDecimals: 9,
            minimumQty: new BigNumber(0.001)
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            baseCurrencyDecimals: 9,
            quoteCurrency: 'XTZ',
            quoteCurrencyDecimals: 6,
            minimumQty: new BigNumber(0.0001)
          }
        ],
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'BTC',
            baseCurrencyDecimals: 8,
            quoteCurrency: 'ETH',
            quoteCurrencyDecimals: 9,
            minimumQty: new BigNumber(0.001)
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            baseCurrencyDecimals: 4,
            quoteCurrency: 'XTZ',
            quoteCurrencyDecimals: 2,
            minimumQty: new BigNumber(0.01)
          }
        ]
      ],
    ]
  ];

export default validGetSymbolsTestCases;
