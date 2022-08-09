import type { AtomexBlockchainOptions } from '../../atomex/models/index';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import { Web3BlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

export const createDefaultEthereumBlockchainOptions = (): AtomexBlockchainOptions => {
  const mainnetRpcUrl = 'https://eth-mainnet.public.blastapi.io';
  const testNetRpcUrl = 'https://rpc.goerli.mudit.blog';
  const balancesProvider = new EthereumBalancesProvider();
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();

  const ethereumOptions: AtomexBlockchainOptions = {
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

  return ethereumOptions;
};
