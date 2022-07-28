import { FetchMock } from 'jest-fetch-mock';

import type { AuthenticationResponseData } from '../../src/authorization/models/index';
import {
  AuthorizationManager, SignersManager, InMemoryAuthorizationManagerStore, InMemoryTezosSigner,
  type AtomexNetwork
} from '../../src/index';


describe('Atomex authorization', () => {
  const fetchMock = fetch as FetchMock;

  // TODO: Use test hours
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
    const tokenResponse: AuthenticationResponseData = {
      id: 'user-id',
      token: 'token-value',
      expires: 0
    };

    fetchMock.mockResponseOnce(JSON.stringify(tokenResponse));

    const address = await signer.getAddress();

    const now = Date.now();
    jest.useFakeTimers().setSystemTime(now);
    const authToken = await authorizationManager.authorize(address);
    jest.useRealTimers();

    expect(authToken.address).toBe(address);
    expect(authToken.userId).toBe(tokenResponse.id);
    expect(authToken.value).toBe(tokenResponse.token);
    expect(authToken.expired.getTime() - (now + authTokenExpirationPeriodMs)).toBeLessThanOrEqual(3 * 60 * 1000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
