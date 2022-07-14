import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../common/index';

export interface BalancesProvider {
  getBalance(address: string, currency: Currency): Promise<BigNumber>;
}
