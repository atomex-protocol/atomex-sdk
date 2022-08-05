import type { SwapTransactionsProvider, Transaction } from '../../blockchain/index';
import type { Swap } from '../../index';
export declare class EthereumSwapTransactionsProvider implements SwapTransactionsProvider {
    getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]>;
}
