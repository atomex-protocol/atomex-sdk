import { AddSwapRequisites, GetSwapsRequest, TxType } from "./type";
export declare const addSwapRequisites: (swapID: string, swapRequisites: AddSwapRequisites, authToken: string) => Promise<Response>;
export declare const getSwaps: (getOrdersRequest: GetSwapsRequest, authToken: string) => Promise<Response>;
export declare const getSwap: (swapID: string, authToken: string) => Promise<Response>;
export declare const addSwapTxInfo: (swapID: string, txID: string, txType: TxType, authToken: string) => Promise<Response>;
