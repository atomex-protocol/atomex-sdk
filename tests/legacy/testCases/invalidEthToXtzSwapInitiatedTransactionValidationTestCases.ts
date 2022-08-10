/* eslint-disable max-len */
import type { OperationContentsAndResultTransaction } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import type { Transaction as EthereumTransaction } from 'web3-eth';

import type { Swap } from '../../../src/index';

const invalidEthToXtzSwapInitiatedTransactionValidationTestCases: ReadonlyArray<readonly [
  message: string,
  data: {
    swap: Swap;
    ethereumTransactions: ReadonlyMap<string, EthereumTransaction>;
    tezosTransactions: ReadonlyMap<string, OperationContentsAndResultTransaction>;
  },
  expectedErrors: readonly string[]
]> = [
    [
      'Invalid amount',
      {
        swap: {
          isInitiator: false,
          secret: '',
          secretHash: '77b69f8fb007c72cac98b014a46caafe49a29bf488a72a12191f6a61b13e65a4',
          id: 444,
          from: {
            currencyId: 'ETH',
            amount: new BigNumber(0.020000007),
            price: new BigNumber(933.318151358)
          },
          to: {
            currencyId: 'XTZ',
            amount: new BigNumber(18.66637),
            price: new BigNumber(0.001071446)
          },
          trade: {
            qty: new BigNumber(18.66637),
            price: new BigNumber(0.001071446),
            side: 'Buy',
            symbol: 'XTZ/ETH'
          },
          timeStamp: new Date('2022-08-10T02:02:17.806Z'),
          counterParty: {
            status: 'Initiated',
            transactions: [
              {
                id: 'onztZ67hetnmjKDY1zUTrngjPEVKWQuSTwoZQDUYcrmiQcyhDTm',
                blockId: 990168,
                confirmations: 0,
                currencyId: 'XTZ',
                status: 'Confirmed',
                type: 'Lock'
              }
            ],
            requisites: {
              secretHash: '77b69f8fb007c72cac98b014a46caafe49a29bf488a72a12191f6a61b13e65a4',
              receivingAddress: '0xda6376ee4544b7e50f40678089fa8f2abf442f45',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0),
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            trades: [
              {
                orderId: 235549,
                price: new BigNumber(0.001071446),
                qty: new BigNumber(18.66637)
              }
            ]
          },
          user: {
            status: 'Involved',
            transactions: [],
            requisites: {
              secretHash: null,
              receivingAddress: 'tz1LS4SQJj4BuNBLAsBPgZo9cNPTrBtr5tZA',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.017466),
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            trades: [
              {
                orderId: 235557,
                price: new BigNumber(0.001071446),
                qty: new BigNumber(18.66637)
              }
            ]
          }
        },
        ethereumTransactions: new Map(),
        tezosTransactions: new Map()
      },
      [
        'Initiate transaction that satisfies the expected criteria is not found in onztZ67hetnmjKDY1zUTrngjPEVKWQuSTwoZQDUYcrmiQcyhDTm contents:',
        'Net amount: expect 18648904, actual 18648894'
      ]
    ]
  ];

export default invalidEthToXtzSwapInitiatedTransactionValidationTestCases;
