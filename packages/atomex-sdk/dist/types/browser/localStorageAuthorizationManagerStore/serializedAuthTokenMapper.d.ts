import type { AuthToken } from '../../authorization/index';
import type { SerializedAuthToken } from './serializedAuthToken';
export interface SerializedAuthTokenMapper {
    mapAuthTokenToSerializedAuthToken(authToken: AuthToken): SerializedAuthToken | null;
    mapSerializedAuthTokenToAuthToken(serializedAuthToken: SerializedAuthToken): AuthToken | null;
}
