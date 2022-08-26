import { CachedBalanceManager } from '../../../src/blockchain/balanceManager';

export class MockBalanceManager extends CachedBalanceManager {
  getBalance = jest.fn<ReturnType<CachedBalanceManager['getBalance']>, Parameters<CachedBalanceManager['getBalance']>>(
    (...args: Parameters<CachedBalanceManager['getBalance']>) => super.getBalance(...args)
  );

  dispose = jest.fn<ReturnType<CachedBalanceManager['dispose']>, Parameters<CachedBalanceManager['dispose']>>(
    (...args: Parameters<CachedBalanceManager['dispose']>) => super.dispose(...args)
  );
}
