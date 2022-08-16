import BigNumber from 'bignumber.js';

import type { WebSocketOrderBookEntriesResponseDto, WebSocketOrderBookSnapshotResponseDto } from '../../../src/clients/dtos';
import type { OrderBook, } from '../../../src/exchange/index';

const validWsOrderBookUpdatedTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [snapshotDtos: WebSocketOrderBookSnapshotResponseDto[], entryDtos: WebSocketOrderBookEntriesResponseDto[], updatedOrderBooks: OrderBook[]]
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
        [{
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
        }]
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
        [{
          updateId: 57553,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: []
        }]
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
        [{
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
        }]
      ]
    ],
    [
      'Update qty profile',
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
            qtyProfile: [2.0]
          }]
        }],
        [{
          updateId: 57552,
          symbol: 'ETH/BTC',
          quoteCurrency: 'ETH',
          baseCurrency: 'BTC',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.06688964),
              qtyProfile: [2.0]
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
        [{
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
        }]
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
        [{
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
        }]
      ]
    ],
    [
      'Update several order books',
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
        },
        {
          event: 'snapshot',
          data: {
            updateId: 57552,
            symbol: 'XTZ/ETH',
            entries: [{
              side: 'Buy',
              price: 0.05555555,
              qtyProfile: [5.0]
            }, {
              side: 'Sell',
              price: 0.06666666,
              qtyProfile: [2.5]
            }]
          }
        }],
        [{
          event: 'entries',
          data: [{
            updateId: 57553,
            symbol: 'ETH/BTC',
            side: 'Buy',
            price: 0.06688964,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [{
            updateId: 57554,
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
              updateId: 57555,
              symbol: 'ETH/BTC',
              side: 'Buy',
              price: 0.06691233,
              qtyProfile: [10]
            }]
        },
        {
          event: 'entries',
          data: [{
            updateId: 57556,
            symbol: 'XTZ/ETH',
            side: 'Buy',
            price: 0.05555555,
            qtyProfile: []
          }]
        },
        {
          event: 'entries',
          data: [{
            updateId: 57557,
            symbol: 'XTZ/ETH',
            side: 'Buy',
            price: 0.04444444,
            qtyProfile: [1]
          }]
        },
        {
          event: 'entries',
          data: [
            {
              updateId: 57558,
              symbol: 'ETH/BTC',
              side: 'Sell',
              price: 0.06754435,
              qtyProfile: [15]
            }]
        },
        {
          event: 'entries',
          data: [{
            updateId: 57559,
            symbol: 'XTZ/ETH',
            side: 'Sell',
            price: 0.06666666,
            qtyProfile: [5.5]
          }]
        }],
        [{
          updateId: 57558,
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
            },
          ]
        },
        {
          updateId: 57559,
          symbol: 'XTZ/ETH',
          quoteCurrency: 'XTZ',
          baseCurrency: 'ETH',
          entries: [
            {
              side: 'Sell',
              price: new BigNumber(0.06666666),
              qtyProfile: [5.5]
            },
            {
              side: 'Buy',
              price: new BigNumber(0.04444444),
              qtyProfile: [1]
            },
          ]
        }]
      ]
    ]
  ];

export default validWsOrderBookUpdatedTestCases;
