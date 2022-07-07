import type { AuthToken } from '../../authorization/index';
import type { SerializedAuthToken } from './serializedAuthToken';
import type { SerializedAuthTokenMapper } from './serializedAuthTokenMapper';
export declare class DefaultSerializedAuthTokenMapper implements SerializedAuthTokenMapper {
    mapAuthTokenToSerializedAuthToken(authToken: AuthToken): SerializedAuthToken | null;
    mapSerializedAuthTokenToAuthToken(serializedAuthToken: SerializedAuthToken): AuthToken | null;
}
