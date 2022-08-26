import type BigNumber from 'bignumber.js';
import { Currency, DataSource } from '../../common';
import type { AtomexBlockchainProvider } from '../atomexBlockchainProvider';
import type { BalanceManager } from './balanceManager';
export declare class CachedBalanceManager implements BalanceManager {
    readonly blockchainProvider: AtomexBlockchainProvider;
    private static readonly cacheExpirationTime;
    private readonly cache;
    constructor(blockchainProvider: AtomexBlockchainProvider);
    getBalance(address: string, currency: Currency, dataSource?: DataSource): Promise<BigNumber | undefined>;
    dispose(): Promise<void>;
    private getCacheKey;
}
