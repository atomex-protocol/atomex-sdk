import type { ToEventEmitters } from '../../src/core/index';
import { AuthorizationManager, type AuthorizationManagerOptions, type AuthToken, InMemoryAuthorizationManagerStore, WalletsManager } from '../../src/index';

export class TestAuthorizationManager extends AuthorizationManager {
  readonly authToken: AuthToken | undefined | ((address: string) => AuthToken | undefined);

  constructor(
    authToken: AuthToken | ((address: string) => AuthToken | undefined)
  ) {
    const defaultOptions: AuthorizationManagerOptions = {
      atomexNetwork: 'testnet',
      walletsManager: new WalletsManager('testnet'),
      store: new InMemoryAuthorizationManagerStore(),
      authorizationBaseUrl: 'https://fake-api.test.atomex.me'
    };

    super(defaultOptions);
    this.authToken = authToken;
  }

  getAuthToken(address: string): AuthToken | undefined {
    return typeof this.authToken === 'function'
      ? this.authToken(address)
      : this.authToken;
  }

  emitAuthorizedEvent(authToken: AuthToken) {
    (this.events as ToEventEmitters<this['events']>).authorized.emit(authToken);
  }

  emitUnauthorizedEvent(authToken: AuthToken) {
    (this.events as ToEventEmitters<this['events']>).unauthorized.emit(authToken);
  }
}
