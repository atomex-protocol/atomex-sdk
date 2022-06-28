import type { Transaction } from './models';

export interface TransactionsProvider {
  getTransaction(transactionHash: string): Promise<Transaction>;
  getTransactions(address: string): Promise<readonly Transaction[]>;
}
