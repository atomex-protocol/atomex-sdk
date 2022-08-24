import type { Currency } from '../../../src';
import type { CurrencyBalanceProvider } from '../../../src/blockchain';

export class MockCurrencyBalanceProvider implements CurrencyBalanceProvider {
  constructor(readonly currency: Currency) {
  }

  getBalance = jest.fn<ReturnType<CurrencyBalanceProvider['getBalance']>, Parameters<CurrencyBalanceProvider['getBalance']>>();
}
