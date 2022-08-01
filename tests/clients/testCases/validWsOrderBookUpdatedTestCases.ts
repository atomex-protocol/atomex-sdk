import BigNumber from 'bignumber.js';

import type { WebSocketOrderBookResponseDto } from '../../../src/clients/dtos';
import type { OrderBook, } from '../../../src/exchange/index';

const validWsOrderBookUpdatedTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: WebSocketOrderBookResponseDto, orderBook: OrderBook]
]> = [
    [
      'Simple quote',
      [
        {
          event: 'entries',
          data: [{
            updateId: 57551,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: [
              4.0
            ]
          },
          {
            updateId: 57551,
            symbol: 'ETH/BTC',
            side: 'Sell',
            price: 0.06754710,
            qtyProfile: [
              1.5
            ]
          }]
        },
        {
          updateId: 57551,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06688964),
              qtyProfile: [
                4.0
              ]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.06754710),
              qtyProfile: [
                1.5
              ]
            }
          ]
        }
      ]
    ]
  ];

export default validWsOrderBookUpdatedTestCases;
