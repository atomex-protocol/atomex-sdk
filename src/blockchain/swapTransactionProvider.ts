import type { Swap } from '../swaps/index';
import type { Transaction } from './models/index';
import type { TransactionsProvider } from './transactionsProvider';

export interface SwapTransactionsProvider extends TransactionsProvider {
  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>
}
