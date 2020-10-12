import { AddOrderRequest, GetOrdersRequest, Order, Side } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

// TODO: non-json response will throw error

/**
 * Create a new Order in Atomex
 *
 * @param addOrderRequest details of the order being placed
 * @param authToken atomex authorization token
 * @returns order id
 */
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

/**
 * Query and filter all available orders in Atomex
 *
 * @param getOrdersRequest filters for querying all orders
 * @param authToken atomex authorization token
 * @returns list of orders
 */
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

/**
 * Query specific Order using Order ID
 *
 * @param orderID order id to query
 * @param authToken atomex authorization token
 * @returns details of requested order
 */
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

/**
 * Cancel an order request in Atomex
 *
 * @param orderID id of order to cancel
 * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
 * @param side side of the order `Buy` or `Sell`
 * @param authToken atomex authorization token
 * @returns true/false value depending on operation success
 */
export const cancelOrder = async (
  orderID: string,
  symbol: string,
  side: Side,
  authToken: string,
): Promise<boolean> => {
  let url = new URL(getBasePath() + "/Orders/" + orderID);
  url = getQueryURL(url, { symbol, side });

  return makeApiRequest(url.toString(), {
    method: "delete",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
