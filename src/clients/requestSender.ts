import { DeepRequired } from '../core/index';

interface HttpClientOptions {
  urlPath: string;
  method?: 'GET' | 'POST' | 'DELETE'
  authToken?: string;
  params?: { [key: string]: string | number | boolean | null | undefined };
}

export class HttpClient {
  constructor(
    protected readonly baseUrl: string
  ) { }

  async request<T>(options: HttpClientOptions): Promise<T> {
    const url = new URL(options.urlPath, this.baseUrl);

    if (options.params)
      this.setSearchParams(url, options.params);

    const headers: { [key: string]: string } = {};
    if (options.authToken)
      headers['Authorization'] = `Bearer ${options.authToken}`;

    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw Error(errorBody);
    }

    return await response.json();
  }

  private setSearchParams(url: URL, params: DeepRequired<HttpClientOptions['params']>) {
    for (const key in params) {
      const value = params[key];
      if (value !== null && value !== undefined)
        url.searchParams.set(key, String(value));
    }
  }
}
