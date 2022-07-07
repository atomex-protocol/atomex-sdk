import type { AuthToken } from '../../index';
import type { SerializedAuthToken } from './serializedAuthToken';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import type { StoreStrategy } from './storeStrategy';
interface AuthTokensStoreObject {
    [address: string]: SerializedAuthToken;
}
export declare class SingleKeyStoreStrategy implements StoreStrategy {
    protected readonly localStorage: Storage;
    protected readonly serializedAuthTokenMapper: SerializedAuthTokenMapper;
    readonly keyPrefix: string;
    protected static readonly DefaultKeyPrefix = "authTokens";
    constructor(localStorage: Storage, serializedAuthTokenMapper: SerializedAuthTokenMapper, keyPrefix?: string);
    protected get key(): string;
    getAuthToken(address: string): AuthToken | undefined;
    getAuthTokens(addresses: string[]): AuthToken[];
    upsertAuthToken(address: string, authToken: AuthToken): AuthToken;
    removeAuthToken(address: string): boolean;
    protected getSerializedAuthTokensStoreObject(): AuthTokensStoreObject;
}
export {};
