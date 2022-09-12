import type { AuthMessage } from './authMessage';
import type { AuthTokenSource } from './authTokenSource';

export interface AuthorizationParameters {
  address: string;
  authTokenSource?: AuthTokenSource;
  blockchain?: string;
  authMessage?: AuthMessage;
}
