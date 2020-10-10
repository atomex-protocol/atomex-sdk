import { AddOrderRequest, GetOrdersRequest, Order, Side } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

// TODO: non-json response will throw error
export const addOrder = async (
  addOrderRequest: AddOrderRequest,
  authToken: string,
): Promise<number> => {
  const url = new URL(getBasePath() + "/Orders");

  return makeApiRequest(url.toString(), {
    method: "post",
    body: JSON.stringify(addOrderRequest),
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getOrders = async (
  getOrdersRequest: GetOrdersRequest,
  authToken: string,
): Promise<Order[]> => {
  let url = new URL(getBasePath() + "/Orders");
  url = getQueryURL(url, { ...getOrdersRequest });

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

export const getOrder = async (
  orderID: string,
  authToken: string,
): Promise<Order> => {
  const url = new URL(getBasePath() + "/Orders/" + orderID);

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

// TODO: non-json response will throw error
export const cancelOrder = async (
  id: string,
  symbol: string,
  side: Side,
  authToken: string,
): Promise<boolean> => {
  let url = new URL(getBasePath() + "/Orders/" + id);
  url = getQueryURL(url, { symbol, side });

  return makeApiRequest(url.toString(), {
    method: "delete",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
