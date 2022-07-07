import type { AuthToken } from '../../authorization/index';
import type { AuthorizationManagerStore } from '../../stores/index';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import type { StoreStrategy } from './storeStrategy';
declare type PreDefinedStoreStrategyName = 'single-key' | 'multiple-keys';
export declare class LocalStorageAuthorizationManagerStore implements AuthorizationManagerStore {
    protected readonly storeStrategy: StoreStrategy;
    constructor(storeStrategy?: PreDefinedStoreStrategyName | StoreStrategy, serializedAuthTokenMapper?: SerializedAuthTokenMapper);
    getAuthToken(address: string): Promise<AuthToken | undefined>;
    getAuthTokens(...addresses: string[]): Promise<AuthToken[]>;
    upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken>;
    removeAuthToken(authToken: AuthToken): Promise<boolean>;
    removeAuthToken(address: string): Promise<boolean>;
    private createPreDefinedStoreStrategy;
}
export {};
