import type { AtomexNetwork } from '../../common/index';
import type { AuthorizationManagerStore } from '../../stores/index';

export interface AuthorizationManagerOptions {
  atomexNetwork: AtomexNetwork;
  store: AuthorizationManagerStore;
  authorizationBaseUrl: string;
  expiringNotificationTimeInSeconds?: number;
}
