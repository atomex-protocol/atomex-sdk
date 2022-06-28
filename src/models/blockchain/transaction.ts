export interface Transaction {
  readonly id: string;
  readonly blockchain: string;
  readonly blockId: string;
  readonly currencyId: string;
  readonly confirmations: number;
  readonly status: string;
}
