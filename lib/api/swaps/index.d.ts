import { AddSwapRequisites, GetSwapsRequest, Swap } from "../../type";
/**
 * Add Requisites to a Swap in Atomex
 *
 * @param swapID id of swap
 * @param swapRequisites swap requisites being updated
 * @param authToken atomex authorization token
 * @returns true/false depending on operation success
 */
export declare const addSwapRequisites: (authToken: string, swapID: string, swapRequisites: AddSwapRequisites) => Promise<boolean>;
/**
 * Query and filter all available swaps in Atomex
 *
 * @param getSwapsRequest filters for querying all swaps
 * @param authToken atomex authorization token
 * @returns a list of swaps
 */
export declare const getSwaps: (authToken: string, getSwapsRequest?: GetSwapsRequest | undefined) => Promise<Swap[]>;
/**
 * Query specific Swap using Swap ID
 *
 * @param swapID id of swap
 * @param authToken atomex authorization token
 * @returns details of swap requested
 */
export declare const getSwap: (authToken: string, swapID: string) => Promise<Swap>;
