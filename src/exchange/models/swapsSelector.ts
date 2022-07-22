import { CollectionSelector } from '../../index';

export interface SwapsSelector extends CollectionSelector {
  symbols?: string;
  active?: boolean;
  afterId?: number;
  completed?: boolean;
}
