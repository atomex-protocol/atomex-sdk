import type { AuthToken } from '../../authorization/index';
import type { SerializedAuthToken } from './serializedAuthToken';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';

export class DefaultSerializedAuthTokenMapper implements SerializedAuthTokenMapper {
  mapAuthTokenToSerializedAuthToken(authToken: AuthToken): SerializedAuthToken | null {
    return {
      a: authToken.address,
      u: authToken.userId,
      e: authToken.expired.getTime(),
      v: authToken.value,
      r: this.mapAuthTokenRequestDataToSerializedAuthTokenRequestData(authToken.request)
    };
  }

  mapSerializedAuthTokenToAuthToken(serializedAuthToken: SerializedAuthToken): AuthToken | null {
    if (!serializedAuthToken.r)
      return null;

    return {
      address: serializedAuthToken.a,
      userId: serializedAuthToken.u,
      expired: new Date(serializedAuthToken.e),
      value: serializedAuthToken.v,
      request: this.mapSerializedAuthTokenRequestDataToAuthTokenRequestData(serializedAuthToken.r)
    };
  }

  protected mapAuthTokenRequestDataToSerializedAuthTokenRequestData(authTokenRequestData: AuthToken['request']): SerializedAuthToken['r'] {
    return {
      m: authTokenRequestData.message,
      t: authTokenRequestData.timeStamp,
      pk: authTokenRequestData.publicKey,
      s: authTokenRequestData.signature,
      a: authTokenRequestData.algorithm,
      sdt: authTokenRequestData.signingDataType
    };
  }

  protected mapSerializedAuthTokenRequestDataToAuthTokenRequestData(serializedAuthTokenRequestData: SerializedAuthToken['r']): AuthToken['request'] {
    return {
      message: serializedAuthTokenRequestData.m,
      timeStamp: serializedAuthTokenRequestData.t,
      publicKey: serializedAuthTokenRequestData.pk,
      signature: serializedAuthTokenRequestData.s,
      algorithm: serializedAuthTokenRequestData.a,
      signingDataType: serializedAuthTokenRequestData.sdt
    };
  }
}
