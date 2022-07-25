import { Swap, SwapsSelector } from '../index';

export interface SwapService {
  getSwap(accountAddress: string, swapId: number): Promise<Swap>;
  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
}
