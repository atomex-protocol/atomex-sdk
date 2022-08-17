type QueryParams = { [key: string]: string | number | boolean | null | undefined };
type Payload = { [key: string]: unknown };

export interface RequestOptions {
  urlPath: string;
  method?: 'GET' | 'POST' | 'DELETE'
  authToken?: string;
  params?: QueryParams;
  payload?: Payload;
}

export class HttpClient {
  constructor(
    protected readonly baseUrl: string
  ) { }

  async request<T>(options: RequestOptions): Promise<T | undefined>;
  async request<T>(options: RequestOptions, returnUndefinedOn404: true): Promise<T | undefined>;
  async request<T>(options: RequestOptions, returnUndefinedOn404: false): Promise<T>;
  async request<T>(options: RequestOptions, returnUndefinedOn404 = true): Promise<T | undefined> {
    const url = new URL(options.urlPath, this.baseUrl);

    if (options.params)
      this.setSearchParams(url, options.params);

    const response = await fetch(url.toString(), {
      headers: this.createHeaders(options),
      method: options.method || 'GET',
      body: options.payload ? JSON.stringify(options.payload) : undefined
    });

    if (returnUndefinedOn404 && response.status === 404)
      return undefined;

    if (!response.ok) {
      const errorBody = await response.text();
      throw Error(errorBody);
    }

    return await response.json();
  }

  private setSearchParams(url: URL, params: RequestOptions['params']) {
    for (const key in params) {
      const value = params[key];
      if (value !== null && value !== undefined)
        url.searchParams.set(key, String(value));
    }
  }

  private createHeaders(options: RequestOptions): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    if (options.authToken)
      headers['Authorization'] = `Bearer ${options.authToken}`;

    if (options.method === 'POST' && options.payload)
      headers['Content-Type'] = 'application/json';

    return headers;
  }
}
