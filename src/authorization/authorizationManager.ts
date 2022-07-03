import type { Signer } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { fetch } from '../native/index';
import type { AuthorizationManagerStore } from '../stores/index';
import { atomexUtils } from '../utils/index';
import type {
  AuthenticationRequestData, AuthenticationResponseData, AuthorizationManagerOptions,
  AuthToken, AuthTokenData
} from './models/index';

export class AuthorizationManager {
  protected static readonly DEFAULT_AUTH_MESSAGE = 'Signing in ';
  protected static readonly DEFAULT_GET_AUTH_TOKEN_URI = '/v1/token';
  protected static readonly DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS = 60;

  readonly atomexNetwork: AtomexNetwork;

  protected readonly store: AuthorizationManagerStore;
  protected readonly authorizationUrl: URL;
  protected readonly expiringNotificationTimeInSeconds: number;

  private readonly _signers: Signer[] = [];
  private readonly _signersByAddress: Map<string, Signer> = new Map();
  private readonly _authTokenData: Map<string, AuthTokenData> = new Map();
  private _isInitialized = false;

  constructor(options: AuthorizationManagerOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.store = options.store;

    for (const signer of options.signers) {
      atomexUtils.ensureNetworksAreSame(this, signer);
      this._signers.push(signer);
    }

    this.authorizationUrl = new URL(AuthorizationManager.DEFAULT_GET_AUTH_TOKEN_URI, options.authorizationBaseUrl);
    this.expiringNotificationTimeInSeconds = options.expiringNotificationTimeInSeconds || AuthorizationManager.DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  protected get signers(): ReadonlyMap<string, Signer> {
    return this._signersByAddress;
  }

  protected get authTokenData(): ReadonlyMap<string, AuthTokenData> {
    return this._authTokenData;
  }

  async initialize() {
    this._isInitialized = false;

    await AuthorizationManager.groupSignersByAddress(this._signers, this._signersByAddress);
    const authTokensFromStore = await this.store.getAuthTokens(...this._signersByAddress.keys());

    this._authTokenData.clear();
    authTokensFromStore.forEach(authToken => this.registerAuthToken(authToken, false));

    this._isInitialized = true;
  }

  getAuthToken(address: string): AuthToken | undefined {
    return this.authTokenData.get(address)?.authToken;
  }

  async authorize(
    address: string,
    forceRequestNewToken = false,
    authMessage: string = AuthorizationManager.DEFAULT_AUTH_MESSAGE
  ): Promise<AuthToken> {
    if (!forceRequestNewToken) {
      const authToken = this.getAuthToken(address);
      if (authToken && !this.isTokenExpiring(authToken))
        return authToken;
    }

    const signer = this.signers.get(address);
    if (!signer)
      throw new Error(`Not found: the corresponding signer by the ${address} address`);

    const timeStamp = this.getAuthorizationTimeStamp(authMessage);
    const atomexSignature = await signer.sign(authMessage + timeStamp);

    if (atomexSignature.address !== address)
      throw new Error('Invalid address in the signed data');

    const authenticationResponseData = await this.requestAuthToken({
      message: authMessage,
      publicKey: atomexSignature.publicKeyBytes,
      algorithm: atomexSignature.algorithm,
      signature: atomexSignature.signatureBytes,
      timeStamp
    });

    const authToken: AuthToken = {
      value: authenticationResponseData.token,
      userId: authenticationResponseData.id,
      address,
      expired: new Date(authenticationResponseData.expires)
    };

    await this.registerAuthToken(authToken, true);

    return authToken;
  }

  protected async registerAuthToken(authToken: AuthToken, isNeedSave: boolean): Promise<AuthToken | undefined> {
    const watcherId = this.trackAuthToken(authToken);
    if (!watcherId)
      return;

    const authTokenData = {
      authToken,
      watcherId
    };
    this._authTokenData.set(authToken.address, authTokenData);

    if (isNeedSave)
      authToken = await this.store.upsertAuthToken(authToken.address, authToken);

    return authToken;
  }

  protected async unregisterAuthToken(authToken: AuthToken): Promise<boolean> {
    const authTokenData = this._authTokenData.get(authToken.address);
    if (!authTokenData)
      return false;

    this.untrackAuthToken(authTokenData.watcherId);
    const result = await this.store.removeAuthToken(authToken);

    return result ? this._authTokenData.delete(authToken.address) : result;
  }

  protected trackAuthToken(authToken: AuthToken): AuthTokenData['watcherId'] {
    const tokenDuration = authToken.expired.getTime() - Date.now();
    if (tokenDuration <= 0) {
      this.store.removeAuthToken(authToken);
      // TODO: emit the "authTokenExpired" event
      return;
    }

    const expiringTokenDuration = tokenDuration - (this.expiringNotificationTimeInSeconds * 1000);
    const watcherId = setTimeout(this.authTokenExpiringTimeoutCallback, expiringTokenDuration, authToken);

    return watcherId;
  }

  protected untrackAuthToken(authTokenWatcherId: AuthTokenData['watcherId']) {
    clearTimeout(authTokenWatcherId);
  }

  protected getAuthorizationTimeStamp(_authMessage: string): number {
    return Date.now();
  }

  protected async requestAuthToken(requestData: AuthenticationRequestData): Promise<AuthenticationResponseData> {
    const response = await fetch(this.authorizationUrl.href, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok)
      throw new Error(await response.text());

    return response.json();
  }

  protected authTokenExpiringTimeoutCallback = (authToken: AuthToken) => {
    const authTokenData = this._authTokenData.get(authToken.address);
    if (!authTokenData)
      return;

    clearTimeout(authTokenData.watcherId);
    const duration = authToken.expired.getTime() - Date.now();
    const newWatcherId = setTimeout(this.authTokenExpiredTimeoutCallback, duration, authToken);

    this._authTokenData.set(authToken.address, {
      ...authTokenData,
      watcherId: newWatcherId
    });
    // TODO: emit the "authTokenExpiring" event
  };

  protected authTokenExpiredTimeoutCallback = (authToken: AuthToken) => {
    // TODO: emit the "authTokenExpired" event
    this.unregisterAuthToken(authToken);
  };

  protected isTokenExpiring(authToken: AuthToken) {
    return (authToken.expired.getTime() - Date.now()) <= (this.expiringNotificationTimeInSeconds * 1000);
  }

  private static async groupSignersByAddress(signers: readonly Signer[], targetMap: Map<string, Signer>) {
    const addressResults = await Promise.allSettled(signers.map(signer => signer.getAddress()));

    targetMap.clear();
    for (let i = 0; i < addressResults.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const addressResult = addressResults[i]!;

      if (addressResult.status !== 'fulfilled') {
        // TODO: warning if status === 'rejected'
        continue;
      }

      const signer = signers[i];
      if (!signer)
        throw new Error('Signers collection has been changed!');

      targetMap.set(addressResult.value, signer);
    }
  }
}
