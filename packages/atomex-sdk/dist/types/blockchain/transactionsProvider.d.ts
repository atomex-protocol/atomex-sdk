import type { Transaction } from './models/index';
export interface TransactionsProvider {
    getTransaction(transactionHash: string): Promise<Transaction>;
    getTransactions(address: string): Promise<readonly Transaction[]>;
}
