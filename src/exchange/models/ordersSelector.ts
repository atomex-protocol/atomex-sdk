import type { CollectionSelector } from '../../common/index';

export interface OrdersSelector extends CollectionSelector {
  symbols?: string;
  active?: boolean;
}
