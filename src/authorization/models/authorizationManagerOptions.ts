import type { WalletsManager } from '../../blockchain/walletsManager';
import type { AtomexNetwork } from '../../common/index';
import type { AuthorizationManagerStore } from '../../stores/index';
import type { AuthMessage } from './authMessage';

export interface AuthorizationManagerOptions {
  atomexNetwork: AtomexNetwork;
  walletsManager: WalletsManager;
  store: AuthorizationManagerStore;
  authorizationBaseUrl: string;
  authMessage?: AuthMessage;
  expiringNotificationTimeInSeconds?: number;
}
