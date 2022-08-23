import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common';

export interface AggregatedRatesProvider {
  getPrice(quoteCurrency: Currency['id'], baseCurrency: Currency['id'], provider?: string): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
