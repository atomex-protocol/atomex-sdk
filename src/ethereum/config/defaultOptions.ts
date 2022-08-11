import type { AtomexBlockchainOptions } from '../../atomex/models/index';
import { Web3BlockchainToolkitProvider } from '../../evm';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

export const createDefaultEthereumBlockchainOptions = (): AtomexBlockchainOptions => {
  const blockchain = 'ethereum';
  const mainnetRpcUrl = 'https://eth-mainnet.public.blastapi.io';
  const testNetRpcUrl = 'https://rpc.goerli.mudit.blog';

  const balancesProvider = new EthereumBalancesProvider();
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();

  const ethereumOptions: AtomexBlockchainOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: ethereumMainnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: ethereumTestnetCurrencies,
      currencyOptions: {},
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return ethereumOptions;
};
