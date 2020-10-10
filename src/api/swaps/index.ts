import { GetSwapsRequest, Swap, SwapRequisites } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

// TODO: non-json response will throw error
export const addSwapRequisites = async (
  swapID: string,
  swapRequisites: SwapRequisites,
  authToken: string,
): Promise<boolean> => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);

  return makeApiRequest(url.toString(), {
    method: "post",
    body: JSON.stringify(swapRequisites),
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getSwaps = async (
  getOrdersRequest: GetSwapsRequest,
  authToken: string,
): Promise<Swap[]> => {
  let url = new URL(getBasePath() + "/Swaps");
  url = getQueryURL(url, { ...getOrdersRequest });

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getSwap = async (
  swapID: string,
  authToken: string,
): Promise<Swap> => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
