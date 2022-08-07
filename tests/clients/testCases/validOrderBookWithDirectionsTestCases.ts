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
            baseCurrency: 'BTC',
            baseCurrencyDecimals: 8,
            quoteCurrency: 'ETH',
            quoteCurrencyDecimals: 18,
            minimumQty: new BigNumber(0.0001)
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
            baseCurrency: 'BTC',
            baseCurrencyDecimals: 8,
            quoteCurrency: 'ETH',
            quoteCurrencyDecimals: 18,
            minimumQty: new BigNumber(0.0001)
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
        },
        'ETH/BTC'
      ]
    ]
  ];

export default validOrderBookWithDirectionsTestCases;
