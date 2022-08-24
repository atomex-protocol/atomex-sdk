import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface PriceManager {
  getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], service?: string): Promise<BigNumber | undefined>;
  getAveragePrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
