import { AuthResponse, GetTokenRequest } from "../../type";
import { getBasePath, makeApiRequest } from "../util";

/**
 * Get Atomex authorization token
 *
 * @remarks the message details can be generated using [[getAuthMessage]]
 *
 * @param authParam details of the message, timeStamp and signed message with the algorithm used
 * @returns atomex authorization token with expiration time
 */
export const getAuthToken = async (
  authParam: GetTokenRequest,
): Promise<AuthResponse> => {
  const url = new URL(getBasePath() + "/Token");

  return makeApiRequest(url.toString(), {
    method: "post",
    body: JSON.stringify(authParam),
  });
};
