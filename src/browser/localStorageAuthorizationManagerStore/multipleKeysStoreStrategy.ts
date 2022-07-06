import type { AuthToken } from '../../index';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import type { StoreStrategy } from './storeStrategy';

export class MultipleKeysStoreStrategy implements StoreStrategy {
  protected static readonly DefaultKeyPrefix = 'authToken:';

  constructor(
    protected readonly localStorage: Storage,
    protected readonly serializedAuthTokenMapper: SerializedAuthTokenMapper,
    readonly keyPrefix: string = MultipleKeysStoreStrategy.DefaultKeyPrefix
  ) {
  }

  getAuthToken(address: string): AuthToken | undefined {
    const rawAuthToken = localStorage.getItem(this.getKey(address));

    return (rawAuthToken && this.serializedAuthTokenMapper.mapSerializedAuthTokenToAuthToken(JSON.parse(rawAuthToken))
      || undefined);
  }

  getAuthTokens(addresses: string[]): AuthToken[] {
    return addresses.map(address => this.getAuthToken(address))
      .filter(Boolean) as AuthToken[];
  }

  upsertAuthToken(address: string, authToken: AuthToken): AuthToken {
    const serializedAuthToken = this.serializedAuthTokenMapper.mapAuthTokenToSerializedAuthToken(authToken);
    if (!serializedAuthToken)
      throw new Error(`The authToken of the ${address} address can't be stored: serialization is failed`);

    localStorage.setItem(this.getKey(address), JSON.stringify(serializedAuthToken));

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
