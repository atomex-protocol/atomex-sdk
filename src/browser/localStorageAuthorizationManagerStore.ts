import type { AuthToken } from '../authorization/index';
import type { AuthorizationManagerStore } from '../stores';

export class LocalStorageAuthorizationManagerStore implements AuthorizationManagerStore {
  getAuthToken(address: string): Promise<AuthToken | undefined> {
    const rawAuthToken = localStorage.getItem(address);
    if (!rawAuthToken)
      return Promise.resolve(undefined);

    return Promise.resolve(JSON.parse(rawAuthToken));
  }

  getAuthTokens(...addresses: string[]): Promise<AuthToken[]> {
    return Promise.all(addresses
      .map(address => this.getAuthToken(address) as unknown as AuthToken)
      .filter(Boolean)
    );
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
