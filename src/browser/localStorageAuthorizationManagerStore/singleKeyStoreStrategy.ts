import type { AuthToken } from '../../index';
import type { SerializedAuthToken } from './serializedAuthToken';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import type { StoreStrategy } from './storeStrategy';

interface AuthTokensStoreObject {
  [address: string]: SerializedAuthToken;
}

export class SingleKeyStoreStrategy implements StoreStrategy {
  protected static readonly DefaultKeyPrefix = 'authTokens';

  constructor(
    protected readonly localStorage: Storage,
    protected readonly serializedAuthTokenMapper: SerializedAuthTokenMapper,
    readonly keyPrefix: string = SingleKeyStoreStrategy.DefaultKeyPrefix
  ) {
  }

  protected get key() {
    return this.keyPrefix;
  }

  getAuthToken(address: string): AuthToken | undefined {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return serializedAuthTokensStoreObject[address] && (this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(serializedAuthTokensStoreObject[address]!)
      || undefined);
  }

  getAuthTokens(addresses: string[]): AuthToken[] {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();

    return Object.values(serializedAuthTokensStoreObject)
      .map(serializedAuthToken => this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(serializedAuthToken))
      .filter((authToken): authToken is AuthToken => !!authToken && addresses.indexOf(authToken.address) > -1);
  }

  upsertAuthToken(address: string, authToken: AuthToken): AuthToken {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();
    const serializedAuthToken = this.serializedAuthTokenMapper.mapAuthTokenToSerializedAuthToken(authToken);
    if (!serializedAuthToken)
      throw new Error(`The authToken of the ${address} address can't be stored: serialization is failed`);

    serializedAuthTokensStoreObject[address] = serializedAuthToken;
    this.localStorage.setItem(this.key, JSON.stringify(serializedAuthTokensStoreObject));

    return authToken;
  }

  removeAuthToken(address: string): boolean {
    const serializedAuthTokensStoreObject = this.getSerializedAuthTokensStoreObject();

    if (!serializedAuthTokensStoreObject[address])
      return false;

    delete serializedAuthTokensStoreObject[address];
    this.localStorage.setItem(this.key, JSON.stringify(serializedAuthTokensStoreObject));

    return true;
  }

  protected getSerializedAuthTokensStoreObject(): AuthTokensStoreObject {
    const rawAuthTokens = this.localStorage.getItem(this.key);
    if (!rawAuthTokens)
      return {};

    return JSON.parse(rawAuthTokens);
  }
}
