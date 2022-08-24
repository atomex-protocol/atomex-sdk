import BigNumber from 'bignumber.js';

import type { ExchangeSymbol } from '../../../src/exchange';

export const validExchangeSymbols: ExchangeSymbol[] = [
  {
    name: 'ETH/BTC',
    baseCurrency: 'BTC',
    quoteCurrency: 'ETH',
    minimumQty: new BigNumber(0.001),
    decimals: {
      baseCurrency: 8,
      quoteCurrency: 9,
      price: 9
    }
  },
  {
    name: 'XTZ/ETH',
    baseCurrency: 'ETH',
    quoteCurrency: 'XTZ',
    minimumQty: new BigNumber(0.0001),
    decimals: {
      baseCurrency: 9,
      quoteCurrency: 6,
      price: 9
    }
  },
  {
    name: 'XTZ/USDT_XTZ',
    baseCurrency: 'USDT_XTZ',
    quoteCurrency: 'XTZ',
    minimumQty: new BigNumber(0.0001),
    decimals: {
      baseCurrency: 6,
      quoteCurrency: 6,
      price: 9
    }
  },
  {
    name: 'ETH/USDT_XTZ',
    baseCurrency: 'USDT_XTZ',
    quoteCurrency: 'ETH',
    minimumQty: new BigNumber(0.0001),
    decimals: {
      baseCurrency: 6,
      quoteCurrency: 9,
      price: 9
    }
  },
];
