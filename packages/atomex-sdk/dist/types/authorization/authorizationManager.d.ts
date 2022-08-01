import type { SignersManager } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { type PublicEventEmitter } from '../core/index';
import type { AuthorizationManagerStore } from '../stores/index';
import { AuthenticationRequestData, AuthenticationResponseData, AuthorizationManagerOptions, AuthToken, AuthTokenData, AuthorizationParameters } from './models/index';
interface AuthorizationManagerEvents {
    readonly authorized: PublicEventEmitter<readonly [authToken: AuthToken]>;
    readonly unauthorized: PublicEventEmitter<readonly [authToken: AuthToken]>;
    readonly authTokenExpiring: PublicEventEmitter<readonly [expiringAuthToken: AuthToken]>;
    readonly authTokenExpired: PublicEventEmitter<readonly [expiredAuthToken: AuthToken]>;
}
export declare class AuthorizationManager {
    readonly events: AuthorizationManagerEvents;
    protected static readonly DEFAULT_AUTH_MESSAGE = "Signing in ";
    protected static readonly DEFAULT_GET_AUTH_TOKEN_URI = "/v1/token";
    protected static readonly DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS = 60;
    readonly atomexNetwork: AtomexNetwork;
    protected readonly signersManager: SignersManager;
    protected readonly store: AuthorizationManagerStore;
    protected readonly authorizationUrl: URL;
    protected readonly expiringNotificationTimeInSeconds: number;
    private readonly _authTokenData;
    constructor(options: AuthorizationManagerOptions);
    protected get authTokenData(): ReadonlyMap<string, AuthTokenData>;
    getAuthToken(address: string): AuthToken | undefined;
    authorize({ address, authTokenSource, blockchain, authMessage }: AuthorizationParameters): Promise<AuthToken | undefined>;
    unauthorize(address: string): Promise<boolean>;
    dispose(): void;
    protected loadAuthTokenFromStore(address: string): Promise<AuthToken | undefined>;
    protected registerAuthToken(authToken: AuthToken, isNeedSave: boolean): Promise<AuthToken | undefined>;
    protected unregisterAuthToken(authToken: AuthToken): Promise<boolean>;
    protected trackAuthToken(authToken: AuthToken): AuthTokenData['watcherId'];
    protected untrackAuthToken(authTokenWatcherId: AuthTokenData['watcherId']): void;
    protected getAuthorizationTimeStamp(_authMessage: string): number;
    protected requestAuthToken(requestData: AuthenticationRequestData): Promise<AuthenticationResponseData>;
    protected authTokenExpiringTimeoutCallback: (authToken: AuthToken) => void;
    protected authTokenExpiredTimeoutCallback: (authToken: AuthToken) => void;
    protected isTokenExpiring(authToken: AuthToken): boolean;
}
export {};
