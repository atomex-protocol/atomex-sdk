import type { AtomexContext, AtomexBlockchainOptions } from '../../atomex';
import { Web3BlockchainToolkitProvider } from '../../evm/index';
import { EthereumWeb3AtomexProtocolV1 } from '../atomexProtocol/index';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetEthereumAtomexProtocolV1Options, testnetEthereumAtomexProtocolV1Options } from './atomexProtocol';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

export const createDefaultEthereumBlockchainOptions = (atomexContext: AtomexContext): AtomexBlockchainOptions => {
  const blockchain = 'ethereum';
  const mainnetRpcUrl = 'https://mainnet.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf/';
  const testNetRpcUrl = 'https://goerli.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf/';

  const balancesProvider = new EthereumBalancesProvider();
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();

  const ethereumOptions: AtomexBlockchainOptions = {
    mainnet: {
      rpcUrl: mainnetRpcUrl,
      currencies: ethereumMainnetCurrencies,
      currencyOptions: {
        ETH: {
          atomexProtocol: new EthereumWeb3AtomexProtocolV1(
            'mainnet',
            atomexContext.providers.currenciesProvider,
            mainnetEthereumAtomexProtocolV1Options
          )
        }
      },
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: ethereumTestnetCurrencies,
      currencyOptions: {
        ETH: {
          atomexProtocol: new EthereumWeb3AtomexProtocolV1(
            'testnet',
            atomexContext.providers.currenciesProvider,
            testnetEthereumAtomexProtocolV1Options
          )
        }
      },
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return ethereumOptions;
};
