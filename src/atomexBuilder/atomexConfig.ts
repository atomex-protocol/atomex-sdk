import type { DeepReadonly } from '../core/index';
import type { AuthorizationManagerDefaultComponentOptions } from './atomexComponents';
import { ExchangeServiceDefaultComponentOptions } from './atomexComponents/exchangeService';

type AtomexConfigNetworkSection = DeepReadonly<{
  authorization: AuthorizationManagerDefaultComponentOptions,
  exchange: ExchangeServiceDefaultComponentOptions
}>;

export type AtomexConfig = DeepReadonly<{
  mainnet: AtomexConfigNetworkSection,
  testnet: AtomexConfigNetworkSection,
}>;

const atomexApiBaseUrl = 'https://api.atomex.me';
const atomexMainnetConfig: AtomexConfigNetworkSection = {
  authorization: {
    authorizationBaseUrl: atomexApiBaseUrl,
    store: {
      node: {},
      browser: {
        storeStrategy: 'single-key'
      }
    }
  },
  exchange: {
    apiBaseUrl: atomexApiBaseUrl
  }
};

const atomexTestApiBaseUrl = 'https://api.test.atomex.me';
const atomexTestnetConfig: AtomexConfigNetworkSection = {
  authorization: {
    authorizationBaseUrl: atomexTestApiBaseUrl,
    store: {
      node: {},
      browser: {
        storeStrategy: 'single-key'
      }
    }
  },
  exchange: {
    apiBaseUrl: atomexTestApiBaseUrl
  }
};

export const config: AtomexConfig = {
  mainnet: atomexMainnetConfig,
  testnet: atomexTestnetConfig
};
