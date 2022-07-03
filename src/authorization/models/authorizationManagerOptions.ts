import type { Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { AuthorizationManagerStore } from '../../stores/index';

export interface AuthorizationManagerOptions {
  atomexNetwork: AtomexNetwork;
  store: AuthorizationManagerStore;
  signers: Iterable<Signer>;
  authorizationBaseUrl: string;
  expiringNotificationTimeInSeconds?: number;
}
