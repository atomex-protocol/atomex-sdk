import { getQueryURL } from "../util";
import fetch from "isomorphic-unfetch";
import { getBasePath } from "../config";
import { AddOrderRequest, GetOrdersRequest, Side } from "./type";

export const addOrder = (
  addOrderRequest: AddOrderRequest,
  authToken: string
) => {
  const url = new URL(getBasePath() + "/Orders");
  return fetch(url.toString(), {
    method: "post",
    body: JSON.stringify(addOrderRequest),
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getOrders = (
  getOrdersRequest: GetOrdersRequest,
  authToken: string
) => {
  let url = new URL(getBasePath() + "/Orders");
  url = getQueryURL(url, { ...getOrdersRequest });
  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getOrder = (orderID: string, authToken: string) => {
  const url = new URL(getBasePath() + "/Orders/" + orderID);
  return fetch(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const cancelOrder = (
  id: string,
  symbol: string,
  side: Side,
  authToken: string
) => {
  let url = new URL(getBasePath() + "/Orders/" + id);
  url = getQueryURL(url, { symbol, side });
  return fetch(url.toString(), {
    method: "delete",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
