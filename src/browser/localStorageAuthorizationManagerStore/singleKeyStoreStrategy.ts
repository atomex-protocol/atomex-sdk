import type { AuthToken } from '../../index';
import type { StoreStrategy } from './storeStrategy';

interface AuthTokensStoreObject {
  [address: string]: AuthToken;
}

export class SingleKeyStoreStrategy implements StoreStrategy {
  protected static readonly DefaultKeyPrefix = 'authTokens';

  constructor(
    protected readonly localStorage: Storage,
    readonly keyPrefix: string = SingleKeyStoreStrategy.DefaultKeyPrefix
  ) {
  }

  protected get key() {
    return this.keyPrefix;
  }

  getAuthToken(address: string): AuthToken | undefined {
    const authTokensStoreObject = this.getAuthTokensStoreObject();

    return authTokensStoreObject[address];
  }

  getAuthTokens(addresses: string[]): AuthToken[] {
    const authTokensStoreObject = this.getAuthTokensStoreObject();

    return Object.values(authTokensStoreObject)
      .filter(authToken => addresses.indexOf(authToken.address) > -1);
  }

  upsertAuthToken(address: string, authToken: AuthToken): AuthToken {
    const authTokensStoreObject = this.getAuthTokensStoreObject();

    authTokensStoreObject[address] = authToken;
    this.localStorage.setItem(this.key, JSON.stringify(authTokensStoreObject));

    return authToken;
  }

  removeAuthToken(address: string): boolean {
    const authTokensStoreObject = this.getAuthTokensStoreObject();

    if (!authTokensStoreObject[address])
      return false;

    delete authTokensStoreObject[address];
    this.localStorage.setItem(this.key, JSON.stringify(authTokensStoreObject));

    return true;
  }

  protected getAuthTokensStoreObject(): AuthTokensStoreObject {
    const rawAuthTokens = this.localStorage.getItem(this.key);
    if (!rawAuthTokens)
      return {};

    return JSON.parse(rawAuthTokens);
  }
}
