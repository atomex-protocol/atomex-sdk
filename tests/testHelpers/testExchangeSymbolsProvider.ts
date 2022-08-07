import BigNumber from 'bignumber.js';

import { InMemoryExchangeSymbolsProvider } from '../../src/index';

export class TestExchangeSymbolsProvider extends InMemoryExchangeSymbolsProvider {
  constructor() {
    super();

    this.setSymbols([
      {
        name: 'ETH/BTC',
        baseCurrency: 'BTC',
        baseCurrencyDecimals: 8,
        quoteCurrency: 'ETH',
        quoteCurrencyDecimals: 18,
        minimumQty: new BigNumber(0.001)
      },
      {
        name: 'XTZ/ETH',
        baseCurrency: 'ETH',
        baseCurrencyDecimals: 18,
        quoteCurrency: 'XTZ',
        quoteCurrencyDecimals: 6,
        minimumQty: new BigNumber(1)
      }
    ]);
  }
}
