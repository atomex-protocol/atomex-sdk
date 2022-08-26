import type BigNumber from 'bignumber.js';
import type { Currency, DataSource, Disposable } from '../../common/index';
export interface BalanceManager extends Disposable {
    getBalance(address: string, currency: Currency, dataSource?: DataSource): Promise<BigNumber | undefined>;
}
