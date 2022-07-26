import BigNumber from 'bignumber.js';

import { CreatedOrderDto, SymbolDto, } from '../../../src/clients/dtos';
import { NewOrderRequest } from '../../../src/exchange/index';

const validAddOrderTestCases: ReadonlyArray<readonly [
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testValue: readonly [request: NewOrderRequest, createOrderDto: CreatedOrderDto, expectedPayload: any, expectedOrderId: number]
]> = [
    [
      'Simple buy order',
      [
        {
          amount: new BigNumber(1),
          price: new BigNumber(2),
          side: 'Buy',
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          type: 'FillOrKill'
        },
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
          side: 'Sell',
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          type: 'FillOrKill'
        },
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
    ],
  ];

export default validAddOrderTestCases;
