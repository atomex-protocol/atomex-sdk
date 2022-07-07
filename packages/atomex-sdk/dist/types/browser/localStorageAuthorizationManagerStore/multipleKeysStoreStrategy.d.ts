import type { AuthToken } from '../../index';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import type { StoreStrategy } from './storeStrategy';
export declare class MultipleKeysStoreStrategy implements StoreStrategy {
    protected readonly localStorage: Storage;
    protected readonly serializedAuthTokenMapper: SerializedAuthTokenMapper;
    readonly keyPrefix: string;
    protected static readonly DefaultKeyPrefix = "authToken:";
    constructor(localStorage: Storage, serializedAuthTokenMapper: SerializedAuthTokenMapper, keyPrefix?: string);
    getAuthToken(address: string): AuthToken | undefined;
    getAuthTokens(addresses: string[]): AuthToken[];
    upsertAuthToken(address: string, authToken: AuthToken): AuthToken;
    removeAuthToken(address: string): boolean;
    protected getKey(address: string): string;
}
