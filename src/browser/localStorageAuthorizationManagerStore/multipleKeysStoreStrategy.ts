import type { AuthToken } from '../../index';
import type { StoreStrategy } from './storeStrategy';

export class MultipleKeysStoreStrategy implements StoreStrategy {
  protected static readonly DefaultKeyPrefix = 'authToken:';

  constructor(
    protected readonly localStorage: Storage,
    readonly keyPrefix: string = MultipleKeysStoreStrategy.DefaultKeyPrefix
  ) {
  }

  getAuthToken(address: string): AuthToken | undefined {
    const rawAuthToken = localStorage.getItem(this.getKey(address));

    return rawAuthToken ? JSON.parse(rawAuthToken) : undefined;
  }

  getAuthTokens(addresses: string[]): AuthToken[] {
    return addresses.map(address => this.getAuthToken(address))
      .filter(Boolean) as AuthToken[];
  }

  upsertAuthToken(address: string, authToken: AuthToken): AuthToken {
    localStorage.setItem(this.getKey(address), JSON.stringify(authToken));

    return authToken;
  }

  removeAuthToken(address: string): boolean {
    localStorage.removeItem(this.getKey(address));

    return true;
  }

  protected getKey(address: string) {
    return this.keyPrefix + address;
  }
}
