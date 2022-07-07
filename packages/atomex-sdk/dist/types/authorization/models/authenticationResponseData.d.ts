export interface AuthenticationResponseData {
    /**
     * User id
     */
    readonly id: string;
    /**
     * Authentication token
     */
    readonly token: string;
    /**
     * Token expiration timestamp in unix time milliseconds (UTC)
     */
    readonly expires: number;
}
