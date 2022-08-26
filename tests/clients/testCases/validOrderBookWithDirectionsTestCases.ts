import BigNumber from 'bignumber.js';

import type { OrderBookDto } from '../../../src/clients/dtos';
import type { CurrencyDirection, ExchangeSymbol, OrderBook } from '../../../src/exchange/index';

const validOrderBookWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [
    exchangeSymbols: ExchangeSymbol[],
    orderBookDto: OrderBookDto,
    direction: CurrencyDirection,
    orderBook: OrderBook,
    expectedSymbolsInFilter: string
  ]
]> = [
    [
      'Simple order book (sell)',
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
          }
        ],
        {
          updateId: 57551,
          symbol: 'ETH/BTC',
          entries: [
            {
              side: 'Buy',
              price: 0.06688964,
              qtyProfile: [
                4.0
              ]
            },
            {
              side: 'Sell',
              price: 0.06754710,
              qtyProfile: [
                1.5
              ]
            }
          ]
        },
        { from: 'ETH', to: 'BTC' },
        {
          updateId: 57551,
          symbol: 'ETH/BTC',
          baseCurrency: 'ETH',
          quoteCurrency: 'BTC',
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
        },
        'ETH/BTC'
      ]
    ],
    [
      'Simple order book (buy)',
      [
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'ETH',
            quoteCurrency: 'BTC',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              quoteCurrency: 8,
              baseCurrency: 9,
              price: 9
            }
          }
        ],
        {
          updateId: 57551,
          symbol: 'ETH/BTC',
          entries: [
            {
              side: 'Buy',
              price: 0.06688964,
              qtyProfile: [
                4.0
              ]
            },
            {
              side: 'Sell',
              price: 0.06754710,
              qtyProfile: [
                1.5
              ]
            }
          ]
        },
        { from: 'BTC', to: 'ETH' },
        {
          updateId: 57551,
          symbol: 'ETH/BTC',
          baseCurrency: 'ETH',
          quoteCurrency: 'BTC',
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
        },
        'ETH/BTC'
      ]
    ]
  ];

export default validOrderBookWithDirectionsTestCases;
