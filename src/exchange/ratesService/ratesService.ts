import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface RatesService {
  getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined>;
}
