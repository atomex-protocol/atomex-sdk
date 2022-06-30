import { AuthToken } from '../authorization';

export interface AuthorizationManagerStore {
  getAuthToken(address: string): Promise<AuthToken | undefined>;
  getAuthTokens(...addresses: string[]): Promise<AuthToken[]>;

  saveAuthToken(address: string, authToken: AuthToken): Promise<AuthToken>;
  removeAuthToken(authToken: AuthToken): Promise<boolean>;
  removeAuthToken(blockchain: string, address: string): Promise<boolean>;
}
