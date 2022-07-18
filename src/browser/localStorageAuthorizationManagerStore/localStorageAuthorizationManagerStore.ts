import type { AuthToken } from '../../authorization/index';
import type { AuthorizationManagerStore } from '../../stores/index';
import { DefaultSerializedAuthTokenMapper } from './defaultSerializedAuthTokenMapper';
import { MultipleKeysStoreStrategy } from './multipleKeysStoreStrategy';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
import { SingleKeyStoreStrategy } from './singleKeyStoreStrategy';
import type { StoreStrategy } from './storeStrategy';

export type PreDefinedStoreStrategyName = 'single-key' | 'multiple-keys';

export class LocalStorageAuthorizationManagerStore implements AuthorizationManagerStore {
  protected readonly storeStrategy: StoreStrategy;

  constructor(
    storeStrategy: PreDefinedStoreStrategyName | StoreStrategy = 'single-key',
    serializedAuthTokenMapper: SerializedAuthTokenMapper = new DefaultSerializedAuthTokenMapper()
  ) {
    this.storeStrategy = typeof storeStrategy === 'string'
      ? this.createPreDefinedStoreStrategy(storeStrategy, serializedAuthTokenMapper)
      : storeStrategy;
  }

  getAuthToken(address: string): Promise<AuthToken | undefined> {
    return Promise.resolve(this.storeStrategy.getAuthToken(address));
  }

  getAuthTokens(...addresses: string[]): Promise<AuthToken[]> {
    return Promise.resolve(this.storeStrategy.getAuthTokens(addresses));
  }

  upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken> {
    return Promise.resolve(this.storeStrategy.upsertAuthToken(address, authToken));
  }

  removeAuthToken(authToken: AuthToken): Promise<boolean>;
  removeAuthToken(address: string): Promise<boolean>;
  removeAuthToken(addressOrAuthToken: AuthToken | string): Promise<boolean> {
    const address = typeof addressOrAuthToken === 'string'
      ? addressOrAuthToken
      : addressOrAuthToken.address;

    return Promise.resolve(this.storeStrategy.removeAuthToken(address));
  }

  private createPreDefinedStoreStrategy(strategyName: PreDefinedStoreStrategyName, serializedAuthTokenMapper: SerializedAuthTokenMapper) {
    switch (strategyName) {
      case 'single-key':
        return new SingleKeyStoreStrategy(globalThis.localStorage, serializedAuthTokenMapper);
      case 'multiple-keys':
        return new MultipleKeysStoreStrategy(globalThis.localStorage, serializedAuthTokenMapper);
      default:
        throw new Error(`Unknown the store strategy name: ${strategyName}`);
    }
  }
}
