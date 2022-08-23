import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface AggregatedRatesProvider {
  getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], provider?: string): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
