interface Query {
    [key: string]: any;
}
/**
 * Helper function to append query params to a url
 *
 * @param url url to append query params
 * @param query key:value pair listing all the query params
 */
export declare const getQueryURL: (url: URL, query: Query) => URL;
export declare const getBasePath: () => string;
/**
 * Helper function to make Atomex API calls
 *
 * @param url url to make api request
 * @param options all options for the request
 * @returns reponse from the request
 */
export declare const makeApiRequest: <T>(url: string, options: RequestInit) => Promise<T>;
export {};
