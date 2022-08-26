import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../../common/index';

export interface CurrencyBalanceProvider {
  readonly currency: Currency;

  getBalance(address: string): Promise<BigNumber>;
}
