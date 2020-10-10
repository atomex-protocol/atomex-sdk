import { SymbolData } from "../../type";
import { getBasePath, makeApiRequest } from "../util";

/**
 * Get list of all available symbols in Atomex
 *
 * @param authToken atomex authorization token
 * @returns list of all the symbols and their minimum qty.
 */
export const getSymbols = async (authToken = ""): Promise<SymbolData[]> => {
  const url = new URL(getBasePath() + "/Symbols");

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
