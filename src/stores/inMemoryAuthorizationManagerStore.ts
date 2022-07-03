import type { AuthToken } from '../authorization/index';
import type { AuthorizationManagerStore } from './authorizationManagerStore';

export class InMemoryAuthorizationManagerStore implements AuthorizationManagerStore {
  protected readonly authTokensMap: Map<string, AuthToken> = new Map();

  getAuthToken(address: string): Promise<AuthToken | undefined> {
    return Promise.resolve(this.authTokensMap.get(address));
  }

  getAuthTokens(...addresses: string[]): Promise<AuthToken[]> {
    return Promise.resolve(
      addresses.reduce(
        (result, address) => {
          const authToken = this.authTokensMap.get(address);
          if (authToken)
            result.push(authToken);

          return result;
        },
        [] as AuthToken[]
      )
    );
  }

  upsertAuthToken(address: string, authToken: AuthToken): Promise<AuthToken> {
    this.authTokensMap.set(address, authToken);

    return Promise.resolve(authToken);
  }

  removeAuthToken(authToken: AuthToken): Promise<boolean>;
  removeAuthToken(address: string): Promise<boolean>;
  removeAuthToken(addressOrAuthToken: AuthToken | string): Promise<boolean> {
    const address = typeof addressOrAuthToken === 'string'
      ? addressOrAuthToken
      : addressOrAuthToken.address;

    return Promise.resolve(this.authTokensMap.delete(address));
  }
}
