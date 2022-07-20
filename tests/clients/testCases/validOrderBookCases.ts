import BigNumber from 'bignumber.js';

import { OrderBookDto } from '../../../src/clients/dtos';
import { OrderBook } from '../../../src/exchange/index';

const validOrderBookCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: OrderBookDto, orderBook: OrderBook]
]> = [
    [
      'Simple order book',
      [
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
        {
          updateId: 57551,
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

export default validOrderBookCases;
