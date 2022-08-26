import type { BalancesProvider } from '../../../src/index';

export class MockBalancesProvider implements BalancesProvider {
  getBalance = jest.fn<ReturnType<BalancesProvider['getBalance']>, Parameters<BalancesProvider['getBalance']>>();
}
