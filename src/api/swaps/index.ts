import { getQueryURL } from "../util";
import fetch from "isomorphic-unfetch";
import { getBasePath } from "../config";
import { AddSwapRequisites, GetSwapsRequest, TxType } from "./type";

export const addSwapRequisites = (
  swapID: string,
  swapRequisites: AddSwapRequisites,
  authToken: string
) => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);
  return fetch(url.toString(), {
    method: "post",
    body: JSON.stringify(swapRequisites),
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getSwaps = (
  getOrdersRequest: GetSwapsRequest,
  authToken: string
) => {
  let url = new URL(getBasePath() + "/Swaps");
  url = getQueryURL(url, { ...getOrdersRequest });
  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getSwap = (swapID: string, authToken: string) => {
  const url = new URL(getBasePath() + "/Swaps/" + swapID);
  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const addSwapTxInfo = (
  swapID: string,
  txID: string,
  txType: TxType,
  authToken: string
) => {
  let url = new URL(getBasePath() + "/Swaps/" + swapID);
  url = getQueryURL(url, { txId: txID, type: txType });
  return fetch(url.toString(), {
    method: "post",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
