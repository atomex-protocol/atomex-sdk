import BigNumber from 'bignumber.js';

import type { CreatedOrderDto } from '../../../src/clients/dtos';
import type { ExchangeSymbol, NewOrderRequest } from '../../../src/exchange/index';

const validAddOrderWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testValue: readonly [request: NewOrderRequest, exchangeSymbols: ExchangeSymbol[], createdOrderDto: CreatedOrderDto, expectedPayload: any, expectedOrderId: number]
]> = [
    [
      'Simple buy order',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            fromAmount: new BigNumber(1),
            price: new BigNumber(2),
            from: 'ETH',
            to: 'XTZ',
          },
          clientOrderId: 'client-order-id',
        },
        [{
          name: 'XTZ/ETH',
          baseCurrency: 'ETH',
          quoteCurrency: 'XTZ',
          minimumQty: new BigNumber(0.0001),
          decimals: {
            baseCurrency: 9,
            quoteCurrency: 6,
            price: 9
          }
        }],
        {
          orderId: 777
        },
        {
          qty: 1,
          price: 2,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Buy',
          type: 'FillOrKill'
        },
        777
      ]
    ],
    [
      'Simple sell order',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            fromAmount: new BigNumber(1),
            price: new BigNumber(2),
            from: 'XTZ',
            to: 'ETH',
          },
          clientOrderId: 'client-order-id',
        },
        [{
          name: 'XTZ/ETH',
          baseCurrency: 'ETH',
          quoteCurrency: 'XTZ',
          minimumQty: new BigNumber(0.0001),
          decimals: {
            baseCurrency: 9,
            quoteCurrency: 6,
            price: 9
          }
        }],
        {
          orderId: 123
        },
        {
          qty: 1,
          price: 2,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Sell',
          type: 'FillOrKill'
        },
        123
      ]
    ]
  ];

export default validAddOrderWithDirectionsTestCases;
