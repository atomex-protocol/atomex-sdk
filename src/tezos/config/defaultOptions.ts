import type { AtomexContext, AtomexBlockchainOptions } from '../../atomex/index';
import { TezosBalancesProvider } from '../balancesProviders/index';
import { TaquitoBlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import { TezosSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { tezosMainnetCurrencies, tezosTestnetCurrencies } from './currencies';

export const createDefaultTezosBlockchainOptions = (_atomexContext: AtomexContext): AtomexBlockchainOptions => {
  const mainnetRpcUrl = 'https://rpc.tzkt.io/mainnet/';
  const testNetRpcUrl = 'https://rpc.tzkt.io/ithacanet/';
  const balancesProvider = new TezosBalancesProvider();
  const swapTransactionsProvider = new TezosSwapTransactionsProvider();

  const tezosOptions: AtomexBlockchainOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: tezosMainnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: tezosTestnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return tezosOptions;
};
