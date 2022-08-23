import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface RatesProvider {
  getPrice(quoteCurrency: Currency['id'], baseCurrency: Currency['id']): Promise<BigNumber | undefined>;
}
