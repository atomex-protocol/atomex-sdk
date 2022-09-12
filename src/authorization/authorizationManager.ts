import type { WalletsManager } from '../blockchain/index';
import type { AtomexService, AtomexNetwork } from '../common/index';
import { EventEmitter, type ToEventEmitters, type PublicEventEmitter } from '../core/index';
import type { AuthorizationManagerStore } from '../stores/index';
import { atomexUtils, prepareTimeoutDuration } from '../utils/index';
import {
  AuthenticationRequestData, AuthenticationResponseData, AuthorizationManagerOptions,
  AuthToken, AuthTokenData, AuthTokenSource, AuthorizationParameters, AuthMessage
} from './models/index';

interface AuthorizationManagerEvents {
  readonly authorized: PublicEventEmitter<readonly [authToken: AuthToken]>;
  readonly unauthorized: PublicEventEmitter<readonly [authToken: AuthToken]>;
  readonly authTokenExpiring: PublicEventEmitter<readonly [expiringAuthToken: AuthToken]>;
  readonly authTokenExpired: PublicEventEmitter<readonly [expiredAuthToken: AuthToken]>;
}

export class AuthorizationManager implements AtomexService {
  readonly events: AuthorizationManagerEvents = {
    authorized: new EventEmitter(),
    unauthorized: new EventEmitter(),
    authTokenExpiring: new EventEmitter(),
    authTokenExpired: new EventEmitter()
  };

  protected static readonly DEFAULT_AUTH_MESSAGE: AuthMessage = 'Signing in ';
  protected static readonly DEFAULT_GET_AUTH_TOKEN_URI = '/v1/token';
  protected static readonly DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS = 60;

  readonly atomexNetwork: AtomexNetwork;

  protected readonly walletsManager: WalletsManager;
  protected readonly store: AuthorizationManagerStore;
  protected readonly authorizationUrl: URL;
  protected readonly defaultAuthMessage: AuthMessage;
  protected readonly expiringNotificationTimeInSeconds: number;

  private readonly _authTokenData: Map<string, AuthTokenData> = new Map();

  private _isStarted = false;

  constructor(options: AuthorizationManagerOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.store = options.store;
    this.walletsManager = options.walletsManager;
    this.defaultAuthMessage = options.authMessage || AuthorizationManager.DEFAULT_AUTH_MESSAGE;

    atomexUtils.ensureNetworksAreSame(this, this.walletsManager);

    this.authorizationUrl = new URL(AuthorizationManager.DEFAULT_GET_AUTH_TOKEN_URI, options.authorizationBaseUrl);
    this.expiringNotificationTimeInSeconds = options.expiringNotificationTimeInSeconds || AuthorizationManager.DEFAULT_EXPIRING_NOTIFICATION_TIME_IN_SECONDS;
  }

  get isStarted() {
    return this._isStarted;
  }

  async start(): Promise<void> {
    if (this.isStarted)
      return;

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    for (const authTokenDataTuple of this.authTokenData)
      this.untrackAuthToken(authTokenDataTuple[1].watcherId);

    this._isStarted = false;
  }

  protected get authTokenData(): ReadonlyMap<string, AuthTokenData> {
    return this._authTokenData;
  }

  getAuthToken(address: string): AuthToken | undefined {
    return this.authTokenData.get(address)?.authToken;
  }

  async authorize({
    address,
    authTokenSource = AuthTokenSource.All,
    blockchain,
    authMessage = this.defaultAuthMessage
  }: AuthorizationParameters): Promise<AuthToken | undefined> {
    if ((authTokenSource & AuthTokenSource.Local) === AuthTokenSource.Local) {
      const authToken = this.getAuthToken(address) || (await this.loadAuthTokenFromStore(address));

      if (authToken && !this.isTokenExpiring(authToken))
        return authToken;
    }

    if ((authTokenSource & AuthTokenSource.Remote) !== AuthTokenSource.Remote)
      return undefined;

    const wallet = await this.walletsManager.getWallet(address, blockchain);
    if (!wallet)
      throw new Error(`Not found: the corresponding wallet by the ${address} address`);

    const authMessageText = typeof authMessage === 'string' ? authMessage : authMessage({ address, blockchain });
    const timeStamp = this.getAuthorizationTimeStamp(authMessageText);
    const atomexSignature = await wallet.sign(authMessageText + timeStamp);

    if (atomexSignature.address !== address)
      throw new Error('Invalid address in the signed data');

    const authenticationRequestData: AuthenticationRequestData = {
      message: authMessageText,
      publicKey: atomexSignature.publicKeyBytes,
      algorithm: atomexSignature.algorithm,
      signingDataType: atomexSignature.signingDataType,
      signature: atomexSignature.signatureBytes,
      timeStamp
    };
    const authenticationResponseData = await this.requestAuthToken(authenticationRequestData);
    const authToken: AuthToken = {
      value: authenticationResponseData.token,
      userId: authenticationResponseData.id,
      address,
      expired: new Date(authenticationResponseData.expires),
      request: authenticationRequestData
    };

    await this.registerAuthToken(authToken, true);

    return authToken;
  }

  async unauthorize(address: string): Promise<boolean> {
    const authToken = this.getAuthToken(address);

    return authToken ? this.unregisterAuthToken(authToken) : false;
  }

  protected async loadAuthTokenFromStore(address: string): Promise<AuthToken | undefined> {
    const authToken = await this.store.getAuthToken(address);

    if (!authToken)
      return undefined;

    return await this.registerAuthToken(authToken, false);
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

    (this.events as ToEventEmitters<this['events']>).authorized.emit(authToken);
    return authToken;
  }

  protected async unregisterAuthToken(authToken: AuthToken): Promise<boolean> {
    const authTokenData = this._authTokenData.get(authToken.address);
    if (!authTokenData)
      return false;

    this.untrackAuthToken(authTokenData.watcherId);
    const result = (await this.store.removeAuthToken(authToken) && this._authTokenData.delete(authToken.address));

    if (result)
      (this.events as ToEventEmitters<this['events']>).unauthorized.emit(authToken);

    return result;
  }

  protected trackAuthToken(authToken: AuthToken): AuthTokenData['watcherId'] {
    const tokenDuration = authToken.expired.getTime() - Date.now();
    if (tokenDuration <= 0) {
      this.store.removeAuthToken(authToken);
      (this.events as ToEventEmitters<this['events']>).authTokenExpired.emit(authToken);

      return;
    }

    const expiringTokenDuration = tokenDuration - (this.expiringNotificationTimeInSeconds * 1000);
    const watcherId = setTimeout(this.authTokenExpiringTimeoutCallback, prepareTimeoutDuration(expiringTokenDuration), authToken);

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
    const newWatcherId = setTimeout(this.authTokenExpiredTimeoutCallback, prepareTimeoutDuration(duration), authToken);

    this._authTokenData.set(authToken.address, {
      ...authTokenData,
      watcherId: newWatcherId
    });
    (this.events as ToEventEmitters<this['events']>).authTokenExpiring.emit(authToken);
  };

  protected authTokenExpiredTimeoutCallback = (authToken: AuthToken) => {
    this.unregisterAuthToken(authToken);
    (this.events as ToEventEmitters<this['events']>).authTokenExpired.emit(authToken);
  };

  protected isTokenExpiring(authToken: AuthToken) {
    return (authToken.expired.getTime() - Date.now()) <= (this.expiringNotificationTimeInSeconds * 1000);
  }
}
