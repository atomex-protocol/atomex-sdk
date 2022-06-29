import type { Signer } from '../blockchain';
import type { AtomexNetwork } from '../common';
import type { AuthorizationManagerStore } from '../stores';
import { atomexUtils } from '../utils';
import type { AuthenticationRequestData, AuthenticationResponseData, AuthToken } from './models';

export class AuthorizationManager {
  isInitialized = false;

  protected authTokenUrl: URL;
  protected _authToken: AuthToken | undefined;

  protected static readonly DEFAULT_AUTH_MESSAGE = 'Signing in ';
  protected static readonly DEFAULT_GET_AUTH_TOKEN_URI = '/v1/token';

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly blockchain: string,
    baseUrl: string,
    protected readonly signer: Signer,
    protected readonly store: AuthorizationManagerStore
  ) {
    atomexUtils.ensureNetworksAreSame(this, signer);

    this.authTokenUrl = new URL(AuthorizationManager.DEFAULT_GET_AUTH_TOKEN_URI, baseUrl);
  }

  get authToken() {
    return this._authToken;
  }

  async initialize() {
    this.isInitialized = false;

    const publicKey = await this.signer.getPublicKey();
    this._authToken = await this.store.getAuthToken(this.blockchain, publicKey);

    this.isInitialized = true;
  }

  async authorize(authMessage: string = AuthorizationManager.DEFAULT_AUTH_MESSAGE): Promise<AuthToken> {
    const timeStamp = this.getAuthorizationTimeStamp(authMessage);
    const signature = await this.signer.sign(authMessage + timeStamp);

    const authToken = await this.requestAuthToken({
      message: authMessage,
      publicKey: signature.publicKey,
      algorithm: signature.algorithm,
      signature: signature.value,
      timeStamp
    });

    return authToken;
  }

  protected getAuthorizationTimeStamp(_authMessage: string): number {
    return Date.now();
  }

  protected async requestAuthToken(requestData: AuthenticationRequestData): Promise<AuthToken> {
    // TODO: use isomorphic fetch
    const response = await fetch(this.authTokenUrl.href, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    if (!response.ok)
      throw new Error(await response.text());

    const authenticationResponseData: AuthenticationResponseData = await response.json();

    return {
      userId: authenticationResponseData.id,
      value: authenticationResponseData.token,
      expired: new Date(authenticationResponseData.expires)
    };
  }
}
