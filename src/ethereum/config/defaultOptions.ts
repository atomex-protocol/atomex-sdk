import type { AtomexBlockchainOptions } from '../../atomex/models/index';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import { Web3BlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

export const createDefaultEthereumBlockchainOptions = (): AtomexBlockchainOptions => {
  const mainnetRpcUrl = 'https://mainnet.infura.io/v3/';
  const testNetRpcUrl = 'https://goerli.infura.io/v3/';
  const balancesProvider = new EthereumBalancesProvider();
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();

  const tezosOptions: AtomexBlockchainOptions = {
    mainnet: {
      currencies: ethereumMainnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      currencies: ethereumTestnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return tezosOptions;
};
