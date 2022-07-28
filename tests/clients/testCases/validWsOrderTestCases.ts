import BigNumber from 'bignumber.js';

import type { WebSocketOrderResponseDto } from '../../../src/clients/dtos';
import type { Order } from '../../../src/exchange/index';

const validWsOrderTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: WebSocketOrderResponseDto, order: Order]
]> = [
    [
      'Simple buy order',
      [
        {
          event: 'order',
          data: {
            id: 176941,
            clientOrderId: '_ea3tfrzcm',
            symbol: 'XTZ/ETH',
            side: 'Buy',
            timeStamp: '2022-07-20T18:28:14.521308Z',
            price: 0.001086855,
            qty: 9.200859360,
            leaveQty: 0.000000000,
            type: 'SolidFillOrKill',
            status: 'Filled',
            trades: [
              {
                orderId: 176941,
                price: 0.001086855,
                qty: 9.200859360
              }
            ],
            swaps: [386]
          }
        },
        {
          id: 176941,
          clientOrderId: '_ea3tfrzcm',
          symbol: 'XTZ/ETH',
          side: 'Buy',
          type: 'SolidFillOrKill',
          leaveQty: new BigNumber(0.000000000),
          status: 'Filled',
          timeStamp: new Date('2022-07-20T18:28:14.521308Z'),
          from: {
            currencyId: 'ETH',
            amount: new BigNumber(0.0099999999997128),
            price: new BigNumber(9.200859360).div(new BigNumber(0.0099999999997128))
          },
          to: {
            currencyId: 'XTZ',
            amount: new BigNumber(9.200859360),
            price: new BigNumber(0.001086855)
          },
          swapIds: [386]
        }
      ]
    ],
    [
      'Simple sell order',
      [
        {
          event: 'order',
          data: {
            id: 180183,
            clientOrderId: '_eqcjx83x9',
            symbol: 'XTZ/ETH',
            side: 'Sell',
            timeStamp: '2022-07-21T10:58:11.698128Z',
            price: 0.001053590,
            qty: 10.000000000,
            leaveQty: 0.000000000,
            type: 'SolidFillOrKill',
            status: 'Filled',
            trades: [
              {
                orderId: 180183,
                price: 0.001053590,
                qty: 10.000000000
              }
            ],
            swaps: [387]
          }
        },
        {
          id: 180183,
          clientOrderId: '_eqcjx83x9',
          symbol: 'XTZ/ETH',
          side: 'Sell',
          type: 'SolidFillOrKill',
          leaveQty: new BigNumber(0.000000000),
          status: 'Filled',
          timeStamp: new Date('2022-07-21T10:58:11.698128Z'),
          from: {
            currencyId: 'XTZ',
            amount: new BigNumber(10),
            price: new BigNumber(0.001053590)
          },
          to: {
            currencyId: 'ETH',
            amount: new BigNumber(0.01053590),
            price: new BigNumber(10.000000000).div(new BigNumber(0.01053590))
          },
          swapIds: [387]
        }
      ]
    ]
  ];

export default validWsOrderTestCases;
