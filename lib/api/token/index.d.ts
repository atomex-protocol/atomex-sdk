import { AuthResponse, GetTokenRequest } from "../../type";
/**
 * Get Atomex authorization token
 *
 * @remarks the message details can be generated using [[getAuthMessage]]
 *
 * @param authParam details of the message, timeStamp and signed message with the algorithm used
 * @returns atomex authorization token with expiration time
 */
export declare const getAuthToken: (authParam: GetTokenRequest) => Promise<AuthResponse>;
