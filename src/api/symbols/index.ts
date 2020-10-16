import { SymbolData } from "../../type";
import { getBasePath, makeApiRequest } from "../util";

/**
 * Get list of all available symbols in Atomex
 *
 * @returns list of all the symbols and their minimum qty.
 */
export const getSymbols = async (): Promise<SymbolData[]> => {
  const url = new URL(getBasePath() + "/Symbols");

  return makeApiRequest(url.toString(), {
    method: "get",
  });
};
