import type { Swap } from '../swaps/index';

export interface AtomexStore {
  getSwap(userId: string, swapId: Swap['id']): Promise<Swap>;
  getSwaps(userId: string): Promise<readonly Swap[]>;
}
