interface Query {
  [key: string]: any;
}
export const getQueryURL = (url: URL, query: Query) => {
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  return url;
};
