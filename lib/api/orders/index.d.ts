import { AddOrderRequest, GetOrdersRequest, Side } from "./type";
export declare const addOrder: (addOrderRequest: AddOrderRequest, authToken: string) => Promise<Response>;
export declare const getOrders: (getOrdersRequest: GetOrdersRequest, authToken: string) => Promise<Response>;
export declare const getOrder: (orderID: string, authToken: string) => Promise<Response>;
export declare const cancelOrder: (id: string, symbol: string, side: Side, authToken: string) => Promise<Response>;
