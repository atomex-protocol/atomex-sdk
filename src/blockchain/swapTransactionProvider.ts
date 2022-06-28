import type { Swap } from '../swaps';
import type { Transaction } from './models';
import type { TransactionsProvider } from './transactionsProvider';

export interface SwapTransactionsProvider extends TransactionsProvider {
  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>
}
