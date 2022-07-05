import type { Swap } from '../swaps/index';
import type { Transaction } from './models/index';

export interface SwapTransactionsProvider {
  getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>
}
