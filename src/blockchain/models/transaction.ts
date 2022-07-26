// export interface Transaction {
//   readonly id: string;
//   readonly blockchain: string;
//   readonly network: string;
//   readonly blockId: string;
//   readonly currencyId: string;
//   readonly confirmations: number;
//   readonly status: string;
// }

export interface Transaction {
  readonly currency: string;
  readonly txId: string;
  readonly blockHeight: number;
  readonly confirmations: number;
  readonly status: TransactionStatus;
  readonly type: TransactionType;
}

export type TransactionStatus = 'Pending' | 'Confirmed' | 'Canceled';
export type TransactionType = 'Lock' | 'AdditionalLock' | 'Redeem' | 'Refund';
