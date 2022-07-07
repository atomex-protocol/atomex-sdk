import type { AuthToken } from '../../index';
export interface StoreStrategy {
    readonly keyPrefix: string;
    getAuthToken(address: string): AuthToken | undefined;
    getAuthTokens(addresses: string[]): AuthToken[];
    upsertAuthToken(address: string, authToken: AuthToken): AuthToken;
    removeAuthToken(address: string): boolean;
}
