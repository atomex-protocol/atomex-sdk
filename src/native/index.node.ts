export { Buffer } from 'node:buffer';

import nodeFetch from 'node-fetch';

const fetchNative = (globalThis.fetch) || nodeFetch;
export {
  fetchNative as fetch
};
