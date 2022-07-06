import type { AuthToken } from '../../authorization/index';
import type { SerializedAuthToken } from './serializedAuthToken';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';

export class DefaultSerializedAuthTokenMapper implements SerializedAuthTokenMapper {
  mapAuthTokenToSerializedAuthToken(authToken: AuthToken): SerializedAuthToken | null {
    return {
      a: authToken.address,
      u: authToken.userId,
      e: authToken.expired.getTime(),
      v: authToken.value
    };
  }

  mapSerializedAuthTokenToAuthToken(serializedAuthToken: SerializedAuthToken): AuthToken | null {
    return {
      address: serializedAuthToken.a,
      userId: serializedAuthToken.u,
      expired: new Date(serializedAuthToken.e),
      value: serializedAuthToken.v
    };
  }
}
