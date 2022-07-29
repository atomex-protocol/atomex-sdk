import BigNumber from 'bignumber.js';

import type { WebSocketTopOfBookResponseDto } from '../../../src/clients/dtos';
import type { Quote } from '../../../src/exchange/index';

const validWsTopOfBookUpdatedTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: WebSocketTopOfBookResponseDto, quote: Quote]
]> = [
    [
      'Simple quote',
      [
        {
          event: 'topOfBook',
          data:
          {
            symbol: 'ETH/BTC',
            timeStamp: 1658231388786,
            bid: 0.06976116,
            ask: 0.07041282
          }
        },
        {
          symbol: 'ETH/BTC',
          timeStamp: new Date(1658231388786),
          bid: new BigNumber(0.06976116),
          ask: new BigNumber(0.07041282),
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC'
        }
      ]
    ]
  ];

export default validWsTopOfBookUpdatedTestCases;
