import BigNumber from 'bignumber.js';

import type { WebSocketOrderBookEntriesResponseDto, WebSocketOrderBookSnapshotResponseDto } from '../../../src/clients/dtos';
import type { OrderBook, } from '../../../src/exchange/index';

const validWsOrderBookUpdatedTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [snapshotDtos: WebSocketOrderBookSnapshotResponseDto[], entryDtos: WebSocketOrderBookEntriesResponseDto[], orderBook: OrderBook]
]> = [
    [
      'Remove entry',
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
          event: 'entries',
          data: [{
            updateId: 57552,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          }]
        }],
        {
          updateId: 57552,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Sell',
              price: new BigNumber(0.06754710),
              qtyProfile: [1.5]
            }
          ]
        }
      ]
    ],
    [
      'Remove entries',
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
          event: 'entries',
          data: [{
            updateId: 57552,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [
            {
              updateId: 57553,
              symbol: 'ETH/BTC',
              side: 'Sell',
              price: 0.06754710,
              qtyProfile: []
            }]
        }],
        {
          updateId: 57553,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: []
        }
      ]
    ],
    [
      'Update entry',
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
          event: 'entries',
          data: [{
            updateId: 57552,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [
            {
              updateId: 57553,
              symbol: 'ETH/BTC',
              side: 'Buy',
              price: 0.06691233,
              qtyProfile: [10]
            }]
        }],
        {
          updateId: 57553,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Sell',
              price: new BigNumber(0.06754710),
              qtyProfile: [1.5]
            },
            {
              side: 'Buy',
              price: new BigNumber(0.06691233),
              qtyProfile: [10]
            }
          ]
        }
      ]
    ],
    [
      'Update entries',
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
          event: 'entries',
          data: [{
            updateId: 57552,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [{
            updateId: 57553,
            symbol: 'ETH/BTC',
            side: 'Sell',
            price: 0.06754710,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [
            {
              updateId: 57554,
              symbol: 'ETH/BTC',
              side: 'Buy',
              price: 0.06691233,
              qtyProfile: [10]
            }]
        },
        {
          event: 'entries',
          data: [
            {
              updateId: 57555,
              symbol: 'ETH/BTC',
              side: 'Sell',
              price: 0.06754435,
              qtyProfile: [15]
            }]
        }],
        {
          updateId: 57555,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06691233),
              qtyProfile: [10]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.06754435),
              qtyProfile: [15]
            }
          ]
        }
      ]
    ],
    [
      'Update entries in one message',
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
          event: 'entries',
          data: [{
            updateId: 57552,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          },
          {
            updateId: 57553,
            symbol: 'ETH/BTC',
            side: 'Sell',
            price: 0.06754710,
            qtyProfile: []
          },
          {
            updateId: 57554,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06691233,
            qtyProfile: [10]
          },
          {
            updateId: 57555,
            symbol: 'ETH/BTC',
            side: 'Sell',
            price: 0.06754435,
            qtyProfile: [15]
          }]
        }],
        {
          updateId: 57555,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06691233),
              qtyProfile: [10]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.06754435),
              qtyProfile: [15]
            }
          ]
        }
      ]
    ]
  ];

export default validWsOrderBookUpdatedTestCases;
