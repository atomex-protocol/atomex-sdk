import { AuthToken } from '../authorization/index';
export interface AuthorizationManagerStore {
    getAuthToken(address: string): Promise<AuthToken | undefined>;
    getAuthTokens(...addresses: string[]): Promise<AuthToken[]>;
    upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken>;
    removeAuthToken(authToken: AuthToken): Promise<boolean>;
    removeAuthToken(address: string): Promise<boolean>;
}
