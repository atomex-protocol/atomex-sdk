import type { FetchMock } from 'jest-fetch-mock';

import type { AuthenticationResponseData } from '../../src/authorization/models/index';
import {
  AuthorizationManager, AuthTokenSource, SignersManager, InMemoryAuthorizationManagerStore, InMemoryTezosSigner,
  type AtomexNetwork, type AuthToken
} from '../../src/index';

describe('Atomex authorization', () => {
  const fetchMock = fetch as FetchMock;

  const authTokenExpirationPeriodMs = 720 * 60 * 60 * 1000;
  const atomexNetwork: AtomexNetwork = 'testnet';
  const signersManager = new SignersManager(atomexNetwork);
  const signer = new InMemoryTezosSigner(atomexNetwork, 'edskReuKVn9gfiboVjbcPkNnhLiyyFLDAwB3CHemb43zpKG3MpBf2CvwDNML2FitCP8fvdLXi4jdDVR1PHB4V9D8BWoYB4SQCU');
  let authorizationManager: AuthorizationManager;

  beforeEach(async () => {
    fetchMock.resetMocks();

    authorizationManager = new AuthorizationManager({
      atomexNetwork,
      signersManager,
      store: new InMemoryAuthorizationManagerStore(),
      authorizationBaseUrl: 'https://fake-api.test.atomex.me'
    });

    await signersManager.addSigner(signer);
  });

  test('first authorization', async () => {
    const now = Date.now();
    const tokenResponse: AuthenticationResponseData = {
      id: 'user-id',
      token: 'token-value',
      expires: now + authTokenExpirationPeriodMs
    };

    fetchMock.mockResponseOnce(JSON.stringify(tokenResponse));

    const address = await signer.getAddress();
    const authToken = await authorizationManager.authorize(address);

    expectAuthTokenToEqualAuthenticationResponseData(address, authToken, tokenResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('authorization with remote and local sources', async () => {
    const now = Date.now();
    const tokenResponse: AuthenticationResponseData = {
      id: 'user-id',
      token: 'token-value',
      expires: now + authTokenExpirationPeriodMs
    };

    fetchMock.mockResponseOnce(JSON.stringify(tokenResponse));

    const address = await signer.getAddress();
    let authToken = await authorizationManager.authorize(address, AuthTokenSource.Remote);
    expectAuthTokenToEqualAuthenticationResponseData(address, authToken, tokenResponse);

    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      authToken = await authorizationManager.authorize(address, AuthTokenSource.Local);
      expectAuthTokenToEqualAuthenticationResponseData(address, authToken, tokenResponse);
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  const expectAuthTokenToEqualAuthenticationResponseData = (
    address: string,
    authToken: AuthToken | undefined | null,
    authResponseData: AuthenticationResponseData,
  ) => {
    expect(authToken).toBeDefined();
    expect(authToken?.address).toBe(address);
    expect(authToken?.userId).toBe(authResponseData.id);
    expect(authToken?.value).toBe(authResponseData.token);
    expect(authToken?.expired?.getTime()).toBe(authResponseData.expires);
  };
});
