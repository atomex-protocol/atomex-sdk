import type { Swap } from '../swaps';

export interface AtomexStore {
  getSwap(userId: string, swapId: Swap['id']): Promise<Swap>;
  getSwaps(userId: string): Promise<readonly Swap[]>;
}
