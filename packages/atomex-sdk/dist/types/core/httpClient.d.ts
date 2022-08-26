declare type QueryParams = {
    [key: string]: string | number | boolean | null | undefined;
};
declare type Payload = {
    [key: string]: any;
};
export interface RequestOptions {
    urlPath: string;
    method?: 'GET' | 'POST' | 'DELETE';
    authToken?: string;
    params?: QueryParams;
    payload?: Payload;
}
export declare class HttpClient {
    protected readonly baseUrl: string;
    constructor(baseUrl: string);
    request<T>(options: RequestOptions): Promise<T | undefined>;
    request<T>(options: RequestOptions, returnUndefinedOn404: true): Promise<T | undefined>;
    request<T>(options: RequestOptions, returnUndefinedOn404: false): Promise<T>;
    private setSearchParams;
    private createHeaders;
}
export {};
