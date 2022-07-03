import type { AuthToken } from '../authorization/index';
import type { AuthorizationManagerStore } from '../stores/index';

export class LocalStorageAuthorizationManagerStore implements AuthorizationManagerStore {
  getAuthToken(address: string): Promise<AuthToken | undefined> {
    const rawAuthToken = localStorage.getItem(address);
    if (!rawAuthToken)
      return Promise.resolve(undefined);

    return Promise.resolve(JSON.parse(rawAuthToken));
  }

  async getAuthTokens(...addresses: string[]): Promise<AuthToken[]> {
    const result = await Promise.all(addresses.map(address => this.getAuthToken(address)));

    return result.filter(Boolean) as AuthToken[];
  }

  upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken> {
    localStorage.setItem(address, JSON.stringify(authToken));

    return Promise.resolve(authToken);
  }

  removeAuthToken(authToken: AuthToken): Promise<boolean>;
  removeAuthToken(address: string): Promise<boolean>;
  removeAuthToken(addressOrAuthToken: AuthToken | string): Promise<boolean> {
    const address = typeof addressOrAuthToken === 'string'
      ? addressOrAuthToken
      : addressOrAuthToken.address;

    localStorage.removeItem(address);

    return Promise.resolve(true);
  }
}
