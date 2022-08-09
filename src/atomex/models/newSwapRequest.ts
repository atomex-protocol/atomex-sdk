import type { NewOrderRequest } from '../../exchange/index';

export type NewSwapRequest = NewOrderRequest & {
  readonly accountAddress: string;
};
