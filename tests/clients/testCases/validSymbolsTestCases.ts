import BigNumber from 'bignumber.js';

import { SymbolDto } from '../../../src/clients/dtos';
import { ExchangeSymbol } from '../../../src/exchange/index';

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
            quoteCurrency: 'BTC',
            baseCurrency: 'KUSD'
          },
          {
            name: 'BTC/USDT',
            minimumQty: new BigNumber(0.002),
            quoteCurrency: 'BTC',
            baseCurrency: 'USDT'
          }
        ]
      ]
    ]
  ];

export default validSymbolsTestCases;
