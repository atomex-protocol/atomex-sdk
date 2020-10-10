import { AddOrderRequest, GetOrdersRequest, Order, Side } from "../../type";
export declare const addOrder: (addOrderRequest: AddOrderRequest, authToken: string) => Promise<number>;
export declare const getOrders: (getOrdersRequest: GetOrdersRequest, authToken: string) => Promise<Order[]>;
export declare const getOrder: (orderID: string, authToken: string) => Promise<Order>;
export declare const cancelOrder: (id: string, symbol: string, side: Side, authToken: string) => Promise<boolean>;
