export interface Transaction {
    readonly currency: string;
    readonly txId: string;
    readonly blockHeight: number;
    readonly confirmations: number;
    readonly status: TransactionStatus;
    readonly type: TransactionType;
}
export declare type TransactionStatus = 'Pending' | 'Confirmed' | 'Canceled';
export declare type TransactionType = 'Lock' | 'AdditionalLock' | 'Redeem' | 'Refund';
