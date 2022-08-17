import BigNumber from 'bignumber.js';

import type { CreatedOrderDto, NewOrderRequestDto, } from '../../../src/clients/dtos';
import type { FilledNewOrderRequest } from '../../../src/exchange/index';

const emptyRequisites: FilledNewOrderRequest['requisites'] = {
  baseCurrencyContract: '',
  receivingAddress: '',
  lockTime: 0,
  quoteCurrencyContract: '',
  refundAddress: '',
  rewardForRedeem: new BigNumber(0),
  secretHash: ''
};

const emptyRequisitesDto: NewOrderRequestDto['requisites'] = {
  ...emptyRequisites,
  rewardForRedeem: emptyRequisites.rewardForRedeem.toNumber(),
};

const validAddOrderTestCases: ReadonlyArray<readonly [
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testValue: readonly [request: FilledNewOrderRequest, createOrderDto: CreatedOrderDto, expectedPayload: any, expectedOrderId: number]
]> = [
    [
      'Simple buy order',
      [
        {
          orderBody: {
            type: 'FillOrKill',
            amount: new BigNumber(1),
            price: new BigNumber(2),
            side: 'Buy',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
          proofsOfFunds: [],
          requisites: emptyRequisites
        },
        {
          orderId: 777
        },
        {
          qty: 1,
          price: 2,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Buy',
          type: 'FillOrKill',
          proofsOfFunds: [],
          requisites: emptyRequisitesDto
        },
        777
      ]
    ],
    [
      'Simple buy order (via order preview)',
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
              amount: new BigNumber(30),
              price: new BigNumber(0.001107006),
            },
            side: 'Buy',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
          proofsOfFunds: [],
          requisites: emptyRequisites
        },
        {
          orderId: 8473
        },
        {
          qty: 30,
          price: 0.001107006,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Buy',
          type: 'FillOrKill',
          proofsOfFunds: [],
          requisites: emptyRequisitesDto
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
            amount: new BigNumber(1),
            price: new BigNumber(2),
            side: 'Sell',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
          proofsOfFunds: [],
          requisites: emptyRequisites
        },
        {
          orderId: 123
        },
        {
          qty: 1,
          price: 2,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Sell',
          type: 'FillOrKill',
          proofsOfFunds: [],
          requisites: emptyRequisitesDto
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
            side: 'Buy',
            symbol: 'XTZ/ETH',
          },
          clientOrderId: 'client-order-id',
          proofsOfFunds: [],
          requisites: emptyRequisites
        },
        {
          orderId: 12345
        },
        {
          qty: 29.999999,
          price: 0.001107006,
          symbol: 'XTZ/ETH',
          clientOrderId: 'client-order-id',
          side: 'Buy',
          type: 'FillOrKill',
          proofsOfFunds: [],
          requisites: emptyRequisitesDto
        },
        12345
      ]
    ],
  ];

export default validAddOrderTestCases;
