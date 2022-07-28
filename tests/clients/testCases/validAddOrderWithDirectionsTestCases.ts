import BigNumber from 'bignumber.js';

import type { CreatedOrderDto, SymbolDto, } from '../../../src/clients/dtos';
import type { NewOrderRequest } from '../../../src/exchange/index';

const validAddOrderWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testValue: readonly [request: NewOrderRequest, symbolsDto: SymbolDto[], createdOrderDto: CreatedOrderDto, expectedPayload: any, expectedOrderId: number]
]> = [
    [
      'Simple buy order',
      [
        {
          amount: new BigNumber(1),
          price: new BigNumber(2),
          from: 'ETH',
          to: 'XTZ',
          clientOrderId: 'client-order-id',
          type: 'FillOrKill'
        },
        [{
          name: 'XTZ/ETH',
          minimumQty: 0.0001
        }],
        {
          orderId: 777
        },
        {
          amount: 1,
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
          amount: new BigNumber(1),
          price: new BigNumber(2),
          from: 'XTZ',
          to: 'ETH',
          clientOrderId: 'client-order-id',
          type: 'FillOrKill'
        },
        [{
          name: 'XTZ/ETH',
          minimumQty: 0.0001
        }],
        {
          orderId: 123
        },
        {
          amount: 1,
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
