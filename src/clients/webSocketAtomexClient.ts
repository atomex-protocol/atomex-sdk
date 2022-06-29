import type { AuthorizationManager } from '../authorization';
import type { AtomexNetwork } from '../common';
import type { Swap } from '../swaps';
import type { AtomexClient } from './atomexClient';

export class WebSocketAtomexClient implements AtomexClient {
  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly authorizationManager: AuthorizationManager
  ) {
  }

  getSwap(swapId: string): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
