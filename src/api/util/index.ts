import fetch from "isomorphic-unfetch";
import config from "../../config.json";

interface Query {
  [key: string]: any;
}

/**
 * Helper function to append query params to a url
 *
 * @param url url to append query params
 * @param query key:value pair listing all the query params
 */
export const getQueryURL = (url: URL, query: Query) => {
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  return url;
};

export const getBasePath = () => {
  return config.basePath + config.version;
};

/**
 * Helper function to make Atomex API calls
 *
 * @param url url to make api request
 * @param options all options for the request
 * @returns reponse from the request
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
