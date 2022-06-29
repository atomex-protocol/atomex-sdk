import { AuthToken } from '../authorization';

export interface AuthorizationManagerStore {
  getAuthToken(blockchain: string, publicKey: string): Promise<AuthToken | undefined>;
  saveAuthToken(blockchain: string, publicKey: string, authToken: AuthToken): Promise<AuthToken>;
  removeAuthToken(authToken: AuthToken): Promise<boolean>;
  removeAuthToken(blockchain: string, publicKey: string): Promise<boolean>;
}
