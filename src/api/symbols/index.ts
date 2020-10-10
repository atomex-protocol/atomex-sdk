import { SymbolData } from "../../type";
import { getBasePath, makeApiRequest } from "../util";

export const getSymbols = async (authToken = ""): Promise<SymbolData[]> => {
  const url = new URL(getBasePath() + "/Symbols");

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
