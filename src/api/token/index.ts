import { AuthResponse, GetTokenRequest } from "../../type";
import { getBasePath, makeApiRequest } from "../util";

export const getAuthToken = async (
  authParam: GetTokenRequest,
): Promise<AuthResponse> => {
  const url = new URL(getBasePath() + "/Token");
  const body: any = {
    ...authParam,
    algorithm: `${authParam.algorithm}:${authParam.curve}`,
  };
  delete body.curve;

  return makeApiRequest(url.toString(), {
    method: "post",
    body: JSON.stringify(body),
  });
};
