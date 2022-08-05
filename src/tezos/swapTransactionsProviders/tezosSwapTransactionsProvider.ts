import type { SwapTransactionsProvider, Transaction } from '../../blockchain/index';
import type { Swap } from '../../index';

export class TezosSwapTransactionsProvider implements SwapTransactionsProvider {
  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }
}
