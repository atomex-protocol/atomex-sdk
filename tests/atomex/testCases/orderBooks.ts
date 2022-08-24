import BigNumber from 'bignumber.js';

import type { OrderBook } from '../../../src/exchange';

export const validOrderBooks = {
  'XTZ/ETH': [
    {
      updateId: 100,
      symbol: 'XTZ/ETH',
      quoteCurrency: 'XTZ',
      baseCurrency: 'ETH',
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
  ]
} as const;
