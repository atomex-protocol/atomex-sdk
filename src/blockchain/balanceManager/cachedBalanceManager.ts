import type BigNumber from 'bignumber.js';

import { Currency, DataSource } from '../../common';
import { Cache, InMemoryCache } from '../../core/index';
import type { AtomexBlockchainProvider } from '../atomexBlockchainProvider';
import type { BalanceManager } from './balanceManager';

export class CachedBalanceManager implements BalanceManager {
  private static readonly cacheExpirationTime = 1000 * 60 * 1;
  private readonly cache: Cache;

  constructor(
    readonly blockchainProvider: AtomexBlockchainProvider
  ) {
    this.cache = new InMemoryCache({
      absoluteExpirationMs: CachedBalanceManager.cacheExpirationTime
    });
  }

  async getBalance(address: string, currency: Currency, dataSource = DataSource.All): Promise<BigNumber | undefined> {
    const key = this.getCacheKey(address, currency);
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedBalance = this.cache.get<BigNumber>(key);
      if (cachedBalance)
        return cachedBalance;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const balanceProvider = this.blockchainProvider.getCurrencyInfo(currency.id)?.balanceProvider;
      if (!balanceProvider)
        throw new Error(`Balance provider not found for currency: ${currency.id}`);

      const balance = await balanceProvider.getBalance(address);
      this.cache.set(key, balance);

      return balance;
    }

    return undefined;
  }

  dispose(): Promise<void> {
    return this.cache.dispose();
  }

  private getCacheKey(address: string, currency: Currency) {
    return `${address}_${currency.id}`;
  }
}
