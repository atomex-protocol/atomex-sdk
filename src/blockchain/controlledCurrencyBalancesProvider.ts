import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../common/index';
import type { CurrencyBalanceProvider } from './currencyBalanceProvider';

export class ControlledCurrencyBalancesProvider implements CurrencyBalanceProvider {
  constructor(
    readonly currency: Currency,
    protected readonly getBalanceImplementation: (address: string) => Promise<BigNumber>
  ) { }

  getBalance(address: string): Promise<BigNumber> {
    return this.getBalanceImplementation(address);
  }
}
