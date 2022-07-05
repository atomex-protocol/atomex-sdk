export interface Transaction {
  readonly id: string;
  readonly blockchain: string;
  readonly network: string;
  readonly blockId: string;
  readonly currencyId: string;
  readonly confirmations: number;
  readonly status: string;
}
