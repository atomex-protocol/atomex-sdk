import { SymbolData } from "../../type";
/**
 * Get list of all available symbols in Atomex
 *
 * @param authToken atomex authorization token
 * @returns list of all the symbols and their minimum qty.
 */
export declare const getSymbols: (authToken?: string) => Promise<SymbolData[]>;
