/* eslint-disable max-len */
import type { OperationContentsAndResultTransaction } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import type { Transaction as EthereumTransaction } from 'web3-eth';

import type { Swap } from '../../../src/index';

const validEthToXtzSwapInitiatedTransactionValidationTestCases: ReadonlyArray<readonly [
  message: string,
  data: {
    swap: Swap;
    ethereumTransactions: ReadonlyMap<string, EthereumTransaction>;
    tezosTransactions: ReadonlyMap<string, OperationContentsAndResultTransaction>;
  }
]> = [
    [
      'Completed Swap 1',
      {
        swap: {
          isInitiator: false,
          secret: '1c05f0e2c6643882dc86bb11db11477e7c98069c64690a9f885c578c6ac6ea2d',
          secretHash: 'da2d3776195757cf66ebf5c70b5e60df55a8f416154acce8231684f1e0012a3c',
          id: 394,
          from: {
            currencyId: 'ETH',
            amount: new BigNumber(0.049999999),
            price: new BigNumber(911.086187842)
          },
          to: {
            currencyId: 'XTZ',
            amount: new BigNumber(45.554309),
            price: new BigNumber(0.001097591)
          },
          trade: {
            qty: new BigNumber(45.554309392),
            price: new BigNumber(0.001097591),
            side: 'Buy',
            symbol: 'XTZ/ETH'
          },
          timeStamp: new Date('2022-07-26T13:08:51.309Z'),
          counterParty: {
            status: 'Redeemed',
            transactions: [
              {
                id: 'ooWJgSgMTurjAe7qpwFgnAeUjBUFrbqwPC57xXADyW99YtHPorR',
                blockId: 911632,
                confirmations: 0,
                currencyId: 'XTZ',
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                id: '0xb76a2e4cab37b701aa1a34f43183aa0fd4fcad329477dd071457785556150b64',
                blockId: 7294301,
                confirmations: 1,
                currencyId: 'ETH',
                status: 'Confirmed',
                type: 'Redeem'
              }
            ],
            requisites: {
              secretHash: 'da2d3776195757cf66ebf5c70b5e60df55a8f416154acce8231684f1e0012a3c',
              receivingAddress: '0xda6376ee4544b7e50f40678089fa8f2abf442f45',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0),
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            trades: [
              {
                orderId: 196928,
                price: new BigNumber(0.001097591),
                qty: new BigNumber(45.554309392)
              }
            ]
          },
          user: {
            status: 'Redeemed',
            transactions: [
              {
                id: '0x0beca202b17b47bc2c672dbbab1c0222b987bdaa507ba3567dd2204f4cb238b2',
                blockId: 7294298,
                confirmations: 1,
                currencyId: 'ETH',
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                id: 'oo1onA76pDgv3UFYhefTZEuwXeRnH68bt6ioWAA6ejPWQYvgRbL',
                blockId: 912959,
                confirmations: 0,
                currencyId: 'XTZ',
                status: 'Confirmed',
                type: 'Redeem'
              }
            ],
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
                orderId: 196936,
                price: new BigNumber(0.001097591),
                qty: new BigNumber(45.554309392)
              }
            ]
          }
        },
        ethereumTransactions: new Map(),
        tezosTransactions: new Map()
      }
    ]
  ];

export default validEthToXtzSwapInitiatedTransactionValidationTestCases;
