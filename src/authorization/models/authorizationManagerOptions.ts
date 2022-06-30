import type { Signer } from '../../blockchain';
import type { AtomexNetwork } from '../../common';
import type { AuthorizationManagerStore } from '../../stores';

export interface AuthorizationManagerOptions {
  atomexNetwork: AtomexNetwork;
  store: AuthorizationManagerStore;
  signers: Iterable<Signer>;
  authorizationBaseUrl: string;
  expiringNotificationTimeInSeconds?: number;
}
