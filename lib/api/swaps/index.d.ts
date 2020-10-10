import { GetSwapsRequest, Swap, SwapRequisites } from "../../type";
export declare const addSwapRequisites: (swapID: string, swapRequisites: SwapRequisites, authToken: string) => Promise<boolean>;
export declare const getSwaps: (getOrdersRequest: GetSwapsRequest, authToken: string) => Promise<Swap[]>;
export declare const getSwap: (swapID: string, authToken: string) => Promise<Swap>;
