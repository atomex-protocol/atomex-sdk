import { AddSwapRequisites, GetSwapsRequest, Swap } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

/**
 * Add Requisites to a Swap in Atomex
 *
 * @param swapID id of swap
 * @param swapRequisites swap requisites being updated
 * @param authToken atomex authorization token
 * @returns true/false depending on operation success
 */
export const addSwapRequisites = async (
  authToken: string,
  swapID: string,
  swapRequisites: AddSwapRequisites,
): Promise<boolean> => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);

  return makeApiRequest<Record<string, boolean>>(url.toString(), {
    method: "post",
    body: JSON.stringify(swapRequisites),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
  }).then((res) => res["result"]);
};

/**
 * Query and filter all available swaps in Atomex
 *
 * @param getSwapsRequest filters for querying all swaps
 * @param authToken atomex authorization token
 * @returns a list of swaps
 */
export const getSwaps = async (
  authToken: string,
  getSwapsRequest?: GetSwapsRequest,
): Promise<Swap[]> => {
  let url = new URL(getBasePath() + "/Swaps");
  url = getQueryURL(url, { ...getSwapsRequest });

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

/**
 * Query specific Swap using Swap ID
 *
 * @param swapID id of swap
 * @param authToken atomex authorization token
 * @returns details of swap requested
 */
export const getSwap = async (
  authToken: string,
  swapID: string,
): Promise<Swap> => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
