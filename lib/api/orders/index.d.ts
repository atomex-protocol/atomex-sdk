import { AddOrderRequest, GetOrdersRequest, Order, Side } from "../../type";
/**
 * Create a new Order in Atomex
 *
 * @param addOrderRequest details of the order being placed
 * @param authToken atomex authorization token
 * @returns order id
 */
export declare const addOrder: (authToken: string, addOrderRequest: AddOrderRequest) => Promise<number>;
/**
 * Query and filter all available orders in Atomex
 *
 * @param getOrdersRequest optional filters for querying all orders
 * @param authToken atomex authorization token
 * @returns list of orders
 */
export declare const getOrders: (authToken: string, getOrdersRequest?: GetOrdersRequest | undefined) => Promise<Order[]>;
/**
 * Query specific Order using Order ID
 *
 * @param orderID order id to query
 * @param authToken atomex authorization token
 * @returns details of requested order
 */
export declare const getOrder: (authToken: string, orderID: string) => Promise<Order>;
/**
 * Cancel an order request in Atomex
 *
 * @param orderID id of order to cancel
 * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
 * @param side side of the order `Buy` or `Sell`
 * @param authToken atomex authorization token
 * @returns true/false value depending on operation success
 */
export declare const cancelOrder: (authToken: string, orderID: string, symbol: string, side: Side) => Promise<boolean>;
