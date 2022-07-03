import type { AuthorizationManager } from '../authorization/index';
import type { AtomexNetwork } from '../common/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';

export class RestAtomexClient implements AtomexClient {
  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly authorizationManager: AuthorizationManager
  ) {
  }

  getSwap(swapId: string): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
