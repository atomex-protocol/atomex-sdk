import type { AtomexBlockchainOptions } from '../../atomex/models/index';
import { TezosBalancesProvider } from '../balancesProviders/index';
import { TezosBlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import { TezosSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { tezosMainnetCurrencies, tezosTestnetCurrencies } from './currencies';

export const createDefaultTezosBlockchainOptions = (): AtomexBlockchainOptions => {
  const mainnetRpcUrl = 'https://rpc.tzkt.io/mainnet/';
  const testNetRpcUrl = 'https://rpc.tzkt.io/ithacanet/';
  const balancesProvider = new TezosBalancesProvider();
  const swapTransactionsProvider = new TezosSwapTransactionsProvider();

  const tezosOptions: AtomexBlockchainOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: tezosMainnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new TezosBlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: tezosTestnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new TezosBlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return tezosOptions;
};
