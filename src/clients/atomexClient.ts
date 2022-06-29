import type { AtomexNetwork } from '../common';
import type { Swap } from '../swaps';

export interface AtomexClient {
  readonly atomexNetwork: AtomexNetwork;

  getSwap(swapId: string): Promise<Swap>;
}
