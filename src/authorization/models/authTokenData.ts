import type { AuthToken } from './authToken';

export interface AuthTokenData {
  authToken: AuthToken;
  watcherId?: ReturnType<typeof setTimeout>;
}
