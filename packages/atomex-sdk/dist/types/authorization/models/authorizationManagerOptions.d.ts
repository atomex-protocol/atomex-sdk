import { SignersManager } from '../../blockchain/signersManager';
import type { AtomexNetwork } from '../../common/index';
import type { AuthorizationManagerStore } from '../../stores/index';
export interface AuthorizationManagerOptions {
    atomexNetwork: AtomexNetwork;
    signersManager: SignersManager;
    store: AuthorizationManagerStore;
    authorizationBaseUrl: string;
    expiringNotificationTimeInSeconds?: number;
}
