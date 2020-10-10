import fetch from "isomorphic-unfetch";
import config from "../../config.json";

interface Query {
  [key: string]: any;
}

export const getQueryURL = (url: URL, query: Query) => {
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  return url;
};

export const getBasePath = () => {
  return config.basePath + config.version;
};

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
