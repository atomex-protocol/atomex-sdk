import { SymbolData } from "../../type";
/**
 * Get list of all available symbols in Atomex
 *
 * @returns list of all the symbols and their minimum qty.
 */
export declare const getSymbols: () => Promise<SymbolData[]>;
