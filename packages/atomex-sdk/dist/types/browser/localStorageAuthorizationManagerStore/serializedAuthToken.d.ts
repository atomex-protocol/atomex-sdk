export interface SerializedAuthToken {
    /**
     * value
     */
    v: string;
    /**
     * userId
     */
    u: string;
    /**
     * address
     */
    a: string;
    /**
     * expired
     */
    e: number;
    /**
     * request
     */
    r: SerializedAuthTokenRequestData;
}
export interface SerializedAuthTokenRequestData {
    /**
     * message
     */
    m: string;
    /**
     * timeStamp
     */
    t: number;
    /**
     * publicKey
     */
    pk: string;
    /**
     * signature
     */
    s: string;
    /**
     * algorithm
     */
    a: string;
    /**
     * signingDataType
     */
    sdt?: string;
}
