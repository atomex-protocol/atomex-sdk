import type { NewOrderRequest } from '../../exchange/index';
export declare type NewSwapRequest = NewOrderRequest & {
    readonly accountAddress: string;
};
