import type BigNumber from 'bignumber.js';

import type { Currency, DataSource } from '../../common/index';

export interface BalanceManager {
  getBalance(address: string, currency: Currency, dataSource: DataSource): Promise<BigNumber | undefined>;
}
