import BigNumber from 'bignumber.js';

import type { SwapDto } from '../../../src/clients/dtos';
import type { Swap } from '../../../src/index';

const validSwapTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: SwapDto, swap: Swap]
]> = [
    [
      'Simple buy swap',
      [
        {
          id: 386,
          symbol: 'XTZ/ETH',
          side: 'Buy',
          timeStamp: '2022-07-20T18:28:14.521308Z',
          price: 0.001086855,
          qty: 9.200859360,
          secret: 'a81c6fa147161fb1f9cc1cd3215f52295d1c70a4340d4fa9713c813fce4cdfca',
          secretHash: '48eec1e0d74b688ffd5ce8130c3ae2dbd0ebb30fb4d6311af9a541340f0ce212',
          isInitiator: false,
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: 'tz1NAfHajSLNVsgNj58kEB8edRjX8oVpsELS',
              refundAddress: null,
              rewardForRedeem: 0.000000000,
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 176941,
                price: 0.001086855,
                qty: 9.200859360
              }
            ],
            transactions: [
              {
                currency: 'ETH',
                txId: '0xd73e77d92417dcf0968e8d99130fc09f591e77a62516030ef5f3f4731b6c72a3',
                blockHeight: 7260925,
                confirmations: 1,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currency: 'XTZ',
                txId: 'opBQ5TZaWuYvX7zCBw4Mao1i5YajFtqJJMPoPTqhdfQ1vr3jwrX',
                blockHeight: 881923,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          },
          counterParty: {
            requisites: {
              secretHash: '48eec1e0d74b688ffd5ce8130c3ae2dbd0ebb30fb4d6311af9a541340f0ce212',
              receivingAddress: '0xda6376ee4544b7e50f40678089fa8f2abf442f45',
              refundAddress: null,
              rewardForRedeem: 0.000000000,
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 176936,
                price: 0.001086855,
                qty: 9.200859360
              }
            ],
            transactions: [
              {
                currency: 'XTZ',
                txId: 'ooVEybq2FxsgcHCznaTENTEEUS6mhqBdTD55MBoZ1BySS1zJUdc',
                blockHeight: 881902,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currency: 'ETH',
                txId: '0x0df766e5ae47d0a37bcc7b74a719c0305193eed3f7b40c7a5bab133b3e05438e',
                blockHeight: 7260930,
                confirmations: 4,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          }
        },
        {
          id: 386,
          trade: {
            symbol: 'XTZ/ETH',
            side: 'Buy',
            price: new BigNumber(0.001086855),
            qty: new BigNumber(9.200859360),
          },
          from: {
            currencyId: 'ETH',
            amount: new BigNumber(0.009999999),
            price: new BigNumber(920.085992008)
          },
          to: {
            currencyId: 'XTZ',
            amount: new BigNumber(9.200859),
            price: new BigNumber(0.001086855)
          },
          isInitiator: false,
          timeStamp: new Date('2022-07-20T18:28:14.521308Z'),
          secret: 'a81c6fa147161fb1f9cc1cd3215f52295d1c70a4340d4fa9713c813fce4cdfca',
          secretHash: '48eec1e0d74b688ffd5ce8130c3ae2dbd0ebb30fb4d6311af9a541340f0ce212',
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: 'tz1NAfHajSLNVsgNj58kEB8edRjX8oVpsELS',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000000000),
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 176941,
                price: new BigNumber(0.001086855),
                qty: new BigNumber(9.200859360)
              }
            ],
            transactions: [
              {
                currencyId: 'ETH',
                id: '0xd73e77d92417dcf0968e8d99130fc09f591e77a62516030ef5f3f4731b6c72a3',
                blockId: 7260925,
                confirmations: 1,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currencyId: 'XTZ',
                id: 'opBQ5TZaWuYvX7zCBw4Mao1i5YajFtqJJMPoPTqhdfQ1vr3jwrX',
                blockId: 881923,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          },
          counterParty: {
            requisites: {
              secretHash: '48eec1e0d74b688ffd5ce8130c3ae2dbd0ebb30fb4d6311af9a541340f0ce212',
              receivingAddress: '0xda6376ee4544b7e50f40678089fa8f2abf442f45',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000000000),
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 176936,
                price: new BigNumber(0.001086855),
                qty: new BigNumber(9.200859360)
              }
            ],
            transactions: [
              {
                currencyId: 'XTZ',
                id: 'ooVEybq2FxsgcHCznaTENTEEUS6mhqBdTD55MBoZ1BySS1zJUdc',
                blockId: 881902,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currencyId: 'ETH',
                id: '0x0df766e5ae47d0a37bcc7b74a719c0305193eed3f7b40c7a5bab133b3e05438e',
                blockId: 7260930,
                confirmations: 4,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          }
        }
      ]
    ],
    [
      'Simple sell swap',
      [
        {
          id: 387,
          symbol: 'XTZ/ETH',
          side: 'Sell',
          timeStamp: '2022-07-21T10:58:11.698128Z',
          price: 0.001053590,
          qty: 10.000000000,
          secret: '3d8075c84383367908bb48c6e89dd6caf698d203d0c9ee908197078262388d39',
          secretHash: 'd13e978b506d6591a8413b0df2fe50633ae9e56382a8c893bdced902bf45285a',
          isInitiator: false,
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: '0x45659bd6fa53541e6528baedef8800497a89ff2a',
              refundAddress: null,
              rewardForRedeem: 0.000000000,
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Initiated',
            trades: [
              {
                orderId: 180183,
                price: 0.001053590,
                qty: 10.000000000
              }
            ],
            transactions: [
              {
                currency: 'XTZ',
                txId: 'oo3jQxwepJrD7fmDA2v4ZVa1tHAPL44Ag5ZsQ1ZJpvbHeqaz95d',
                blockHeight: 885298,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              }
            ]
          },
          counterParty: {
            requisites: {
              secretHash: 'd13e978b506d6591a8413b0df2fe50633ae9e56382a8c893bdced902bf45285a',
              receivingAddress: 'tz1WeXk76h2uFzLZbS9KaQK3JSFVLCRf9wP8',
              refundAddress: null,
              rewardForRedeem: 0.000000000,
              lockTime: 36000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Redeemed',
            trades: [
              {
                orderId: 180137,
                price: 0.001053590,
                qty: 10.000000000
              }
            ],
            transactions: [
              {
                currency: 'ETH',
                txId: '0xb05434794be53ee2dfa6066d99253cff2d9f1d9e51dac453f9fea4adfd3b9c73',
                blockHeight: 7264862,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currency: 'XTZ',
                txId: 'ooPrwt9FHuJ38ZQ8ZXNZdZyRYrbzQZtivLHEVKd8gbXbDM748Qb',
                blockHeight: 885302,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          }
        },
        {
          id: 387,
          trade: {
            symbol: 'XTZ/ETH',
            side: 'Sell',
            price: new BigNumber(0.001053590),
            qty: new BigNumber(10.000000000)
          },
          from: {
            currencyId: 'XTZ',
            amount: new BigNumber(10),
            price: new BigNumber(0.001053590)
          },
          to: {
            currencyId: 'ETH',
            amount: new BigNumber(0.01053590),
            price: new BigNumber(949.135811843)
          },
          isInitiator: false,
          timeStamp: new Date('2022-07-21T10:58:11.698128Z'),
          secret: '3d8075c84383367908bb48c6e89dd6caf698d203d0c9ee908197078262388d39',
          secretHash: 'd13e978b506d6591a8413b0df2fe50633ae9e56382a8c893bdced902bf45285a',
          user: {
            requisites: {
              secretHash: null,
              receivingAddress: '0x45659bd6fa53541e6528baedef8800497a89ff2a',
              refundAddress: null,
              rewardForRedeem: new BigNumber(0.000000000),
              lockTime: 18000,
              baseCurrencyContract: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
              quoteCurrencyContract: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b'
            },
            status: 'Initiated',
            trades: [
              {
                orderId: 180183,
                price: new BigNumber(0.001053590),
                qty: new BigNumber(10.000000000)
              }
            ],
            transactions: [
              {
                currencyId: 'XTZ',
                id: 'oo3jQxwepJrD7fmDA2v4ZVa1tHAPL44Ag5ZsQ1ZJpvbHeqaz95d',
                blockId: 885298,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              }
            ]
          },
          counterParty: {
            requisites: {
              secretHash: 'd13e978b506d6591a8413b0df2fe50633ae9e56382a8c893bdced902bf45285a',
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
                orderId: 180137,
                price: new BigNumber(0.001053590),
                qty: new BigNumber(10.000000000)
              }
            ],
            transactions: [
              {
                currencyId: 'ETH',
                id: '0xb05434794be53ee2dfa6066d99253cff2d9f1d9e51dac453f9fea4adfd3b9c73',
                blockId: 7264862,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Lock'
              },
              {
                currencyId: 'XTZ',
                id: 'ooPrwt9FHuJ38ZQ8ZXNZdZyRYrbzQZtivLHEVKd8gbXbDM748Qb',
                blockId: 885302,
                confirmations: 0,
                status: 'Confirmed',
                type: 'Redeem'
              }
            ]
          }
        }
      ]
    ]
  ];

export default validSwapTestCases;
