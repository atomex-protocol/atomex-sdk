import BigNumber from 'bignumber.js';

import type { OrderBook } from '../../../src/exchange';

export const validOrderBooks = {
  'XTZ/ETH': [
    {
      updateId: 100,
      symbol: 'XTZ/ETH',
      baseCurrency: 'XTZ',
      quoteCurrency: 'ETH',
      entries: [
        {
          side: 'Buy',
          price: new BigNumber('0.000948468'),
          qtyProfile: [
            300.0
          ]
        },
        {
          side: 'Sell',
          price: new BigNumber('0.000977739'),
          qtyProfile: [
            900.0
          ]
        }
      ]
    } as OrderBook
  ],
  'ETH/USDT_XTZ': [
    {
      updateId: 300,
      symbol: 'ETH/USDT_XTZ',
      baseCurrency: 'ETH',
      quoteCurrency: 'USDT_XTZ',
      entries: [
        {
          side: 'Buy',
          price: new BigNumber('1603.468672'),
          qtyProfile: [
            1.0
          ]
        },
        {
          side: 'Sell',
          price: new BigNumber('1631.228580'),
          qtyProfile: [
            1.0
          ]
        }
      ]
    } as OrderBook
  ],
  'XTZ/USDT_XTZ': [
    {
      updateId: 201,
      symbol: 'XTZ/USDT_XTZ',
      baseCurrency: 'XTZ',
      quoteCurrency: 'USDT_XTZ',
      entries: [
        {
          side: 'Buy',
          price: new BigNumber('1.543187'),
          qtyProfile: [
            100.0
          ]
        },
        {
          side: 'Sell',
          price: new BigNumber('1.575071'),
          qtyProfile: [
            100.0
          ]
        }
      ]
    } as OrderBook
  ]
} as const;
