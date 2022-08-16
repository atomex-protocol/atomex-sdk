import BigNumber from 'bignumber.js';

import type { WebSocketOrderBookSnapshotResponseDto } from '../../../src/clients/dtos';
import type { OrderBook, } from '../../../src/exchange/index';

const validWsOrderBookSnapshotTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [snapshotDtos: WebSocketOrderBookSnapshotResponseDto[], expectedOrderBooks: OrderBook[]]
]> = [
    [
      'Single snapshot',
      [
        [{
          event: 'snapshot',
          data: {
            updateId: 57551,
            symbol: 'ETH/BTC',
            entries: [{
              side: 'Buy',
              price: 0.06688964,
              qtyProfile: [4.0]
            }, {
              side: 'Sell',
              price: 0.06754710,
              qtyProfile: [1.5]
            }]
          }
        }],
        [{
          updateId: 57551,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06688964),
              qtyProfile: [4.0]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.06754710),
              qtyProfile: [1.5]
            }
          ]
        }]
      ]
    ],
    [
      'Several snapshots',
      [
        [{
          event: 'snapshot',
          data: {
            updateId: 57551,
            symbol: 'ETH/BTC',
            entries: [{
              side: 'Buy',
              price: 0.06688964,
              qtyProfile: [4.0]
            }, {
              side: 'Sell',
              price: 0.06754710,
              qtyProfile: [1.5]
            }]
          }
        }, {
          event: 'snapshot',
          data: {
            updateId: 57552,
            symbol: 'XTZ/ETH',
            entries: [{
              side: 'Buy',
              price: 0.66666666,
              qtyProfile: [5.5]
            }, {
              side: 'Sell',
              price: 0.77777777,
              qtyProfile: [3.0]
            }]
          }
        }],
        [{
          updateId: 57551,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06688964),
              qtyProfile: [4.0]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.06754710),
              qtyProfile: [1.5]
            }
          ]
        }, {
          updateId: 57552,
          symbol: 'XTZ/ETH',
          quoteCurrency: 'XTZ',
          baseCurrency: 'ETH',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.66666666),
              qtyProfile: [5.5]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.77777777),
              qtyProfile: [3.0]
            }
          ]
        }]
      ]
    ],
  ];

export default validWsOrderBookSnapshotTestCases;
