interface Query {
    [key: string]: any;
}
export declare const getQueryURL: (url: URL, query: Query) => URL;
export declare const getBasePath: () => string;
export declare const makeApiRequest: <T>(url: string, options: RequestInit) => Promise<T>;
export {};
