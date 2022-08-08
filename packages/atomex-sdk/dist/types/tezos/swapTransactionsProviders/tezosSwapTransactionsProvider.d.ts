import type { SwapTransactionsProvider, Transaction } from '../../blockchain/index';
import type { Swap } from '../../index';
export declare class TezosSwapTransactionsProvider implements SwapTransactionsProvider {
    private _isStarted;
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]>;
}
