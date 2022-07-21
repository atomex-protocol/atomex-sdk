import { DeepRequired } from '../core/index';

interface SendRequestOptions {
  urlPath: string;
  params?: { [key: string]: string | number | boolean | null | undefined };
}

export class RequestSender {
  constructor(
    protected readonly baseUrl: string
  ) { }

  async send<T>(options: SendRequestOptions): Promise<T> {
    const url = new URL(options.urlPath, this.baseUrl);

    if (options.params)
      this.setSearchParams(url, options.params);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorBody = await response.text();
      throw Error(errorBody);
    }

    return await response.json();
  }

  private setSearchParams(url: URL, params: DeepRequired<SendRequestOptions['params']>) {
    for (const key in params) {
      const value = params[key];
      if (value !== null && value !== undefined)
        url.searchParams.set(key, String(value));
    }
  }
}
