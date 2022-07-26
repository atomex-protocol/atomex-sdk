import { CollectionSelector } from '../../index';
export interface OrdersSelector extends CollectionSelector {
    symbols?: string;
    active?: boolean;
}
