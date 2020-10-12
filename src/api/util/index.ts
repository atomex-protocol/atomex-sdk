import fetch from "isomorphic-unfetch";
import config from "../../config.json";

interface Query {
  [key: string]: any;
}

/**
 * Atomex API instance config
 * @ignore
 */
export let instanceConfig = {
  basePath: config.api.mainnet.basePath,
  version: config.api.mainnet.version,
};

/**
 * Helper function to append query params to a url
 *
 * @param url url to append query params
 * @param query key:value pair listing all the query params
 * @ignore
 */
export const getQueryURL = (url: URL, query: Query) => {
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  return url;
};

/**
 * Setup Atomex API connection
 *
 * @param network networks supported by Atomex, can be either mainnet or testnet
 */
export const connect = (network: "mainnet" | "testnet") => {
  instanceConfig = {
    basePath: config.api[network].basePath,
    version: config.api[network].version,
  };
};

/**
 * Helper function to get base path for atomex api
 * @ignore
 */
export const getBasePath = () => {
  return instanceConfig.basePath + instanceConfig.version;
};

/**
 * Helper function to make Atomex API calls
 *
 * @param url url to make api request
 * @param options all options for the request
 * @returns response from the request
 *
 * @ignore
 */
export const makeApiRequest = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
  });

  if (response.ok) return response.json();
  else {
    const errBody = await response.text();
    throw Error(
      JSON.stringify({
        code: `${response.status} ${response.statusText}`,
        body: errBody,
      }),
    );
  }
};
