import BigNumber from 'bignumber.js';

import type { SymbolDto } from '../../../src/clients/dtos';
import type { ExchangeSymbol } from '../../../src/exchange/index';

const validSymbolsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dtos: SymbolDto[], symbols: ExchangeSymbol[]]
]> = [
    [
      'Empty result',
      [
        [],
        []
      ]
    ],
    [
      'Simple symbols',
      [
        [
          {
            name: 'BTC/KUSD',
            minimumQty: 0.0001
          },
          {
            name: 'BTC/USDT',
            minimumQty: 0.002
          },
        ],
        [
          {
            name: 'BTC/KUSD',
            minimumQty: new BigNumber(0.0001),
            baseCurrency: 'BTC',
            quoteCurrency: 'KUSD',
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 9,
              price: 9
            }
          },
          {
            name: 'BTC/USDT',
            minimumQty: new BigNumber(0.002),
            baseCurrency: 'BTC',
            quoteCurrency: 'USDT',
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 6,
              price: 9
            }
          }
        ]
      ]
    ]
  ];

export default validSymbolsTestCases;
