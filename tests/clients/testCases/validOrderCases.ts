import BigNumber from 'bignumber.js';

import { OrderDto } from '../../../src/clients/dtos';
import { Order, OrderStatus } from '../../../src/exchange/index';

const validOrderBookCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: OrderDto, orderBook: Order]
]> = [
    [
      'Simple order',
      [
        {
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
          swaps: [{
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
          }]
        },
        {
          id: 176941,
          clientOrderId: '_ea3tfrzcm',
          side: 'Buy',
          type: 'SolidFillOrKill',
          leaveQty: new BigNumber(0.000000000),
          status: OrderStatus.Filled,
          timeStamp: new Date('2022-07-20T18:28:14.521308Z'),
          from: {
            currencyId: 'ETH',
            amount: new BigNumber(0),
            price: new BigNumber(0)
          },
          to: {
            currencyId: 'XTZ',
            amount: new BigNumber(0),
            price: new BigNumber(0)
          }
        }
      ]
    ]
  ];

export default validOrderBookCases;
