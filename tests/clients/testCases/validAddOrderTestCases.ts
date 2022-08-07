import BigNumber from 'bignumber.js';

import type { CreatedOrderDto, } from '../../../src/clients/dtos';
import type { NewOrderRequest } from '../../../src/exchange/index';

const validAddOrderTestCases: ReadonlyArray<readonly [
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testValue: readonly [request: NewOrderRequest, createOrderDto: CreatedOrderDto, expectedPayload: any, expectedOrderId: number]
]> = [
    [
      'Simple buy order',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            fromAmount: new BigNumber(1),
            price: new BigNumber(2),
            side: 'Buy',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
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
      'Simple buy order',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            from: {
              currencyId: 'XTZ',
              amount: new BigNumber(30),
              price: new BigNumber(0.001107006),
            },
            to: {
              currencyId: 'ETH',
              amount: new BigNumber(0.03321018),
              price: new BigNumber(903.337470618)
            },
            side: 'Buy',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
        },
        {
          orderId: 8473
        },
        {
          amount: 30,
          price: 0.001107006,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Buy',
          type: 'FillOrKill'
        },
        8473
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
            side: 'Sell',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
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
    [
      'Simple sell order (via order preview)',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            from: {
              currencyId: 'ETH',
              amount: new BigNumber(0.03321018),
              price: new BigNumber(903.337470618)
            },
            to: {
              currencyId: 'XTZ',
              amount: new BigNumber(29.999999),
              price: new BigNumber(0.001107006),
            },
            side: 'Sell',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
        },
        {
          orderId: 12345
        },
        {
          amount: 0.03321018,
          price: 903.337470618,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Sell',
          type: 'FillOrKill'
        },
        12345
      ]
    ],
  ];

export default validAddOrderTestCases;
