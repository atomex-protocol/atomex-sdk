import type { Currency } from '../../common/index';

export interface Transaction {
  readonly id: string;
  readonly blockId: number;
  readonly currencyId: Currency['id'];
  readonly status: string;
  readonly confirmations: number;
  readonly type: string;
  // Probably this property is redundant
  // readonly blockchain: string;
}
