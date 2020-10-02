import fetch from "isomorphic-unfetch";
import { getBasePath } from "../config";
import { GetTokenRequest } from "./type";

export const getAuthToken = (authParam: GetTokenRequest) => {
  const url = new URL(getBasePath() + "/Token");
  return fetch(url.toString(), {
    method: "post",
    body: JSON.stringify(authParam),
  });
};
