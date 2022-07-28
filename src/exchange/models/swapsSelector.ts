import type { CollectionSelector } from '../../common/index';

export interface SwapsSelector extends CollectionSelector {
  symbols?: string;
  active?: boolean;
  afterId?: number;
  completed?: boolean;
}
