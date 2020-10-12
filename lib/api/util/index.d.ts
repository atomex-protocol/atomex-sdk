interface Query {
    [key: string]: any;
}
/**
 * Atomex API instance config
 * @ignore
 */
export declare let instanceConfig: {
    basePath: string;
    version: string;
};
/**
 * Helper function to append query params to a url
 *
 * @param url url to append query params
 * @param query key:value pair listing all the query params
 * @ignore
 */
export declare const getQueryURL: (url: URL, query: Query) => URL;
/**
 * Setup Atomex API connection
 *
 * @param network networks supported by Atomex, can be either mainnet or testnet
 */
export declare const connect: (network: "mainnet" | "testnet") => void;
/**
 * Helper function to get base path for atomex api
 * @ignore
 */
export declare const getBasePath: () => string;
/**
 * Helper function to make Atomex API calls
 *
 * @param url url to make api request
 * @param options all options for the request
 * @returns response from the request
 *
 * @ignore
 */
export declare const makeApiRequest: <T>(url: string, options: RequestInit) => Promise<T>;
export {};
