import type { AuthenticationRequestData } from './authenticationRequestData';
export interface AuthToken {
    readonly value: string;
    readonly userId: string;
    readonly address: string;
    readonly expired: Date;
    readonly request: AuthTokenRequestData;
}
export declare type AuthTokenRequestData = AuthenticationRequestData;
