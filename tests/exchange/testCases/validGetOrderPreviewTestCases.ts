import BigNumber from 'bignumber.js';

import type { ExchangeSymbol, OrderBook, OrderPreview, OrderPreviewParameters } from '../../../src/exchange/index';

const validGetOrderPreviewTestCases: ReadonlyArray<[
  message: string,
  orderPreviewParameters: OrderPreviewParameters,
  expectedOrderPreview: OrderPreview,
  symbolUpdates: readonly ExchangeSymbol[][],
  orderBookUpdates: readonly OrderBook[]
]> = [
    [
      'Simple',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber('35.483843'),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('35.483843'),
          price: new BigNumber('0.001132176')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.040173955'),
          price: new BigNumber('883.254909804')
        }
      },
      [
        [
          {
            name: 'ETH/BTC',
            baseCurrency: 'BTC',
            quoteCurrency: 'ETH',
            minimumQty: new BigNumber(0.001),
            decimals: {
              baseCurrency: 8,
              quoteCurrency: 9,
              price: 9
            }
          },
          {
            name: 'XTZ/ETH',
            baseCurrency: 'ETH',
            quoteCurrency: 'XTZ',
            minimumQty: new BigNumber(0.0001),
            decimals: {
              baseCurrency: 9,
              quoteCurrency: 6,
              price: 9
            }
          }
        ]
      ],
      [
        {
          updateId: 100,
          symbol: 'XTZ/ETH',
          baseCurrency: 'ETH',
          quoteCurrency: 'XTZ',
          entries: [
            {
              side: 'Buy',
              price: new BigNumber(0.001097614),
              qtyProfile: [
                300.0
              ]
            },
            {
              side: 'Sell',
              price: new BigNumber(0.001132176),
              qtyProfile: [
                900.0
              ]
            }
          ]
        }
      ]
    ]
  ];

export default validGetOrderPreviewTestCases;
