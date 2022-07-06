import {
  AuthorizationManager, SignersManager, InMemoryAuthorizationManagerStore, InMemoryTezosSigner,
  type AtomexNetwork
} from '../../src/index';

describe('Atomex authorization', () => {
  const authTokenExpirationPeriodMs = 24 * 60 * 60 * 1000;
  const atomexNetwork: AtomexNetwork = 'testnet';
  const signersManager = new SignersManager(atomexNetwork);
  const signer = new InMemoryTezosSigner(atomexNetwork, 'edskReuKVn9gfiboVjbcPkNnhLiyyFLDAwB3CHemb43zpKG3MpBf2CvwDNML2FitCP8fvdLXi4jdDVR1PHB4V9D8BWoYB4SQCU');
  let authorizationManager: AuthorizationManager;

  beforeEach(async () => {
    authorizationManager = new AuthorizationManager({
      atomexNetwork,
      signersManager,
      store: new InMemoryAuthorizationManagerStore(),
      authorizationBaseUrl: 'https://api.test.atomex.me'
    });

    await signersManager.addSigner(signer);
  });

  test('first authorization', async () => {
    const address = await signer.getAddress();

    const now = Date.now();
    jest.useFakeTimers().setSystemTime(now);
    const authToken = await authorizationManager.authorize(address);
    jest.useRealTimers();

    expect(authToken.address).toBe(address);
    expect(authToken.expired.getTime() - (now + authTokenExpirationPeriodMs)).toBeLessThanOrEqual(3 * 60 * 1000);
  });
});
