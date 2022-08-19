import type { DeepReadonly } from '../core/index';
import type { AuthorizationManagerDefaultComponentOptions } from './atomexComponents';
import type { ExchangeServiceDefaultComponentOptions } from './atomexComponents/exchangeService';

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
    apiBaseUrl: atomexApiBaseUrl,
    webSocketApiBaseUrl: 'wss://api.atomex.me'
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
    apiBaseUrl: atomexTestApiBaseUrl,
    webSocketApiBaseUrl: 'wss://ws.api.test.atomex.me'
  }
};

export const config: AtomexConfig = {
  mainnet: atomexMainnetConfig,
  testnet: atomexTestnetConfig
};
