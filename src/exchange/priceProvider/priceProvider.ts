import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface PriceProvider {
  getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined>;
}
