import type { AuthToken } from '../authorization/index';
import type { AuthorizationManagerStore } from './authorizationManagerStore';
export declare class InMemoryAuthorizationManagerStore implements AuthorizationManagerStore {
    protected readonly authTokensMap: Map<string, AuthToken>;
    getAuthToken(address: string): Promise<AuthToken | undefined>;
    getAuthTokens(...addresses: string[]): Promise<AuthToken[]>;
    upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken>;
    removeAuthToken(authToken: AuthToken): Promise<boolean>;
    removeAuthToken(address: string): Promise<boolean>;
}
