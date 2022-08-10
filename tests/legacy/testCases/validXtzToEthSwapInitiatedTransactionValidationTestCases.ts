/* eslint-disable max-len */
import type { OperationContentsAndResultTransaction } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import type { Transaction as EthereumTransaction } from 'web3-eth';

import type { Swap } from '../../../src/index';

const validXtzToEthSwapInitiatedTransactionValidationTestCases: ReadonlyArray<readonly [
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
          id: 424,
          from: {
            currencyId: 'XTZ',
            amount: new BigNumber(10.000000000),
            price: new BigNumber(0.001058409),
          },
          to: {
            currencyId: 'ETH',
            amount: new BigNumber(0.01058409),
            price: new BigNumber(944.814339258),
          },
          trade: {
            symbol: 'XTZ/ETH',
            side: 'Sell',
            price: new BigNumber(0.001058409),
            qty: new BigNumber(10.000000000),
          },
          timeStamp: new Date('2022-08-03T20:24:29.798834Z'),
          secret: '0d7d5b573903a6309028f101ee59d0952738539383baeddf915915b866ce7d5b',
          secretHash: '7560d69b2db27e399cbb1102a40196712643226baf21faa5c369a3c4c3806146',
          isInitiator: false,
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: '0x080950fCc712749A236daBaBd528bbFb141eA484',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000340000),
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 227801,
                price: new BigNumber(0.001058409),
                qty: new BigNumber(10.000000000)
              }
            ],
            transactions: [
              {
                currencyId: 'XTZ',
                id: 'opMtcAES8RUL129sKpHZtJteBmHyvCDwANZLG35yQB9256p6YeT',
                blockId: 957841,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currencyId: 'ETH',
                id: '0x7ed08c39ee0d509266224ec10f2f7e77daa122e98ef1db482d8007ae8f571b50',
                blockId: 7341533,
                confirmations: 1,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          },
          counterParty: {
            requisites: {
              secretHash: '7560d69b2db27e399cbb1102a40196712643226baf21faa5c369a3c4c3806146',
              receivingAddress: 'tz1WeXk76h2uFzLZbS9KaQK3JSFVLCRf9wP8',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000000000),
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 227768,
                price: new BigNumber(0.001058409),
                qty: new BigNumber(10.000000000)
              }
            ],
            transactions: [
              {
                currencyId: 'ETH',
                id: '0xd5be2609cbba45c85e536edc464d1f19695dea46a3d5dda82e6fcaba5dc8c6a3',
                blockId: 7341527,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currencyId: 'XTZ',
                id: 'opUHpydHe44VsgKZ7kxJSAXsNo9vT2mDLt6tKfsnyHULaq1DaG6',
                blockId: 957845,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          }
        },
        ethereumTransactions: new Map<string, EthereumTransaction>()
          .set('0xd5be2609cbba45c85e536edc464d1f19695dea46a3d5dda82e6fcaba5dc8c6a3', {
            blockHash: '0x189d072870794e985c7a2a6a23aca26b295602a48e8efcbd85ca20be14a14ae1',
            blockNumber: 7341527,
            from: '0xdA6376Ee4544b7e50F40678089Fa8f2Abf442f45',
            gas: 182074,
            gasPrice: '25000000000',
            hash: '0xd5be2609cbba45c85e536edc464d1f19695dea46a3d5dda82e6fcaba5dc8c6a3',
            input: '0x48e558da7560d69b2db27e399cbb1102a40196712643226baf21faa5c369a3c4c3806146000000000000000000000000080950fcc712749a236dababd528bbfb141ea4840000000000000000000000000000000000000000000000000000000062eb661d0000000000000000000000000000000000000000000000000001353a6b394000',
            nonce: 241,
            to: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
            transactionIndex: 0,
            value: '10584090000000000'
          })
          .set('0x7ed08c39ee0d509266224ec10f2f7e77daa122e98ef1db482d8007ae8f571b50',
            {
              blockHash: '0xfd42ee1e423abdd8674434048498af38b8d6f5a8a9cca5a6f5439071e89ad003',
              blockNumber: 7341533,
              from: '0xdA6376Ee4544b7e50F40678089Fa8f2Abf442f45',
              gas: 102754,
              gasPrice: '25000000000',
              hash: '0x7ed08c39ee0d509266224ec10f2f7e77daa122e98ef1db482d8007ae8f571b50',
              input: '0xb31597ad7560d69b2db27e399cbb1102a40196712643226baf21faa5c369a3c4c38061460d7d5b573903a6309028f101ee59d0952738539383baeddf915915b866ce7d5b',
              nonce: 243,
              to: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
              transactionIndex: 1,
              value: '0'
            }),
        tezosTransactions: new Map<string, OperationContentsAndResultTransaction>()
      }
    ],
    [
      'In progress Swap 1',
      {
        swap: {
          id: 415,
          from: {
            currencyId: 'XTZ',
            amount: new BigNumber(15.000000000),
            price: new BigNumber(0.001069985),
          },
          to: {
            currencyId: 'ETH',
            amount: new BigNumber(0.016049775),
            price: new BigNumber(934.592541016),

          },
          trade: {
            symbol: 'XTZ/ETH',
            side: 'Sell',
            qty: new BigNumber(15.000000000),
            price: new BigNumber(0.001069985),
          },
          timeStamp: new Date('2022-08-02T10:15:45.755971Z'),
          secret: null,
          secretHash: '4cace3eed8dd2d05ec57fa7185ac63bfb7d3795fb3f6eb8205cb5ac90dad64f3',
          isInitiator: false,
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: '0x2Aff4b63D2ABB1996AfD6b81224a76637e69F8D1',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000340000),
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Involved',
            trades: [
              {
                orderId: 223529,
                price: new BigNumber(0.001069985),
                qty: new BigNumber(15.000000000)
              }
            ],
            transactions: [
            ]
          },
          counterParty: {
            requisites: {
              secretHash: '4cace3eed8dd2d05ec57fa7185ac63bfb7d3795fb3f6eb8205cb5ac90dad64f3',
              receivingAddress: 'tz1WeXk76h2uFzLZbS9KaQK3JSFVLCRf9wP8',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.0000000000),
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Initiated',
            trades: [
              {
                orderId: 223500,
                price: new BigNumber(0.001069985),
                qty: new BigNumber(15.000000000)
              }
            ],
            transactions: [
              {
                currencyId: 'ETH',
                id: '0x719dde7947a18183c180dae72805da88721f3494af5fba3701fde90044df0397',
                blockId: 7333383,
                confirmations: 5,
                status: 'Confirmed',
                type: 'Lock'
              }
            ]
          }
        },
        ethereumTransactions: new Map(),
        tezosTransactions: new Map()
      }
    ]
  ];

export default validXtzToEthSwapInitiatedTransactionValidationTestCases;
