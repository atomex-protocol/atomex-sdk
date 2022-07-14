import type { DeepReadonly } from '../core/index';
import type { AuthorizationManagerDefaultComponentOptions } from './atomexComponents';

type AtomexConfigNetworkSection = DeepReadonly<{
  authorization: AuthorizationManagerDefaultComponentOptions
}>;

export type AtomexConfig = DeepReadonly<{
  mainnet: AtomexConfigNetworkSection,
  testnet: AtomexConfigNetworkSection,
}>;

const atomexMainnetConfig: AtomexConfigNetworkSection = {
  authorization: {
    authorizationBaseUrl: 'https://api.atomex.me',
    store: {
      node: {},
      browser: {
        storeStrategy: 'single-key'
      }
    }
  }
};

const atomexTestnetConfig: AtomexConfigNetworkSection = {
  authorization: {
    authorizationBaseUrl: 'https://api.test.atomex.me',
    store: {
      node: {},
      browser: {
        storeStrategy: 'single-key'
      }
    }
  }
};

export const config: AtomexConfig = {
  mainnet: atomexMainnetConfig,
  testnet: atomexTestnetConfig
};
