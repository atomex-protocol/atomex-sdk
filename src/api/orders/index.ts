import { AddOrderRequest, GetOrdersRequest, Order, Side } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

/**
 * Create a new Order in Atomex
 *
 * @param addOrderRequest details of the order being placed
 * @param authToken atomex authorization token
 * @returns order id
 */
export const addOrder = async (
  authToken: string,
  addOrderRequest: AddOrderRequest,
): Promise<number> => {
  const url = new URL(getBasePath() + "/Orders");

  return makeApiRequest<Record<string, number>>(url.toString(), {
    method: "post",
    body: JSON.stringify(addOrderRequest),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
  }).then((res) => res["orderId"]);
};

/**
 * Query and filter all available orders in Atomex
 *
 * @param getOrdersRequest optional filters for querying all orders
 * @param authToken atomex authorization token
 * @returns list of orders
 */
export const getOrders = async (
  authToken: string,
  getOrdersRequest?: GetOrdersRequest,
): Promise<Order[]> => {
  let url = new URL(getBasePath() + "/Orders");
  if (getOrdersRequest !== undefined)
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
  authToken: string,
  orderID: string,
): Promise<Order> => {
  const url = new URL(getBasePath() + "/Orders/" + orderID);

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

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
  authToken: string,
  orderID: string,
  symbol: string,
  side: Side,
): Promise<boolean> => {
  let url = new URL(getBasePath() + "/Orders/" + orderID);
  url = getQueryURL(url, { symbol, side });

  return makeApiRequest<Record<string, boolean>>(url.toString(), {
    method: "delete",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  }).then((res) => res["result"]);
};
