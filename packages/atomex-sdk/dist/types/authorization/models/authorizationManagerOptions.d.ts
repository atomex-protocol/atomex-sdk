import type { WalletsManager } from '../../blockchain/walletsManager';
import type { AtomexNetwork } from '../../common/index';
import type { AuthorizationManagerStore } from '../../stores/index';
export interface AuthorizationManagerOptions {
    atomexNetwork: AtomexNetwork;
    walletsManager: WalletsManager;
    store: AuthorizationManagerStore;
    authorizationBaseUrl: string;
    expiringNotificationTimeInSeconds?: number;
}
