import type { AtomexComponent } from '../common/index';
import type { Swap } from '../swaps/index';
import type { Transaction } from './models/index';

export interface SwapTransactionsProvider extends AtomexComponent {
  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>;
}
