import type { AtomexNetwork } from '../common/index';
import type { Swap } from '../swaps/index';

export interface AtomexClient {
  readonly atomexNetwork: AtomexNetwork;

  getSwap(swapId: string): Promise<Swap>;
}
