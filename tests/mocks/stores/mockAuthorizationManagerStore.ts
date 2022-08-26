/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OverloadParameters, OverloadReturnType } from '../../../src/core';
import { AuthorizationManagerStore, InMemoryAuthorizationManagerStore } from '../../../src/index';

export class MockAuthorizationManagerStore extends InMemoryAuthorizationManagerStore implements AuthorizationManagerStore {
  getAuthToken = jest.fn<ReturnType<AuthorizationManagerStore['getAuthToken']>, Parameters<AuthorizationManagerStore['getAuthToken']>>(
    (...args: Parameters<AuthorizationManagerStore['getAuthToken']>) => super.getAuthToken(...args)
  );

  getAuthTokens = jest.fn<ReturnType<AuthorizationManagerStore['getAuthTokens']>, Parameters<AuthorizationManagerStore['getAuthTokens']>>(
    (...args: Parameters<AuthorizationManagerStore['getAuthTokens']>) => super.getAuthTokens(...args)
  );

  upsertAuthToken = jest.fn<ReturnType<AuthorizationManagerStore['upsertAuthToken']>, Parameters<AuthorizationManagerStore['upsertAuthToken']>>(
    (...args: Parameters<AuthorizationManagerStore['upsertAuthToken']>) => super.upsertAuthToken(...args)
  );

  removeAuthToken = jest.fn<OverloadReturnType<AuthorizationManagerStore['removeAuthToken']>, OverloadParameters<AuthorizationManagerStore['removeAuthToken']>>(
    (...args: OverloadParameters<AuthorizationManagerStore['removeAuthToken']>) => (super.removeAuthToken as any)(...args)
  );
}
