import type { AtomexContext, AtomexBlockchainOptions, AtomexCurrencyOptions } from '../../atomex/index';
import { Web3BlockchainToolkitProvider } from '../../evm/index';
import { EthereumWeb3AtomexProtocolV1 } from '../atomexProtocol/index';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import type { EthereumCurrency } from '../models';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetEthereumWeb3AtomexProtocolV1Options, testnetEthereumWeb3AtomexProtocolV1Options } from './atomexProtocol';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

const createCurrencyOptions = (
  atomexContext: AtomexContext,
  currencies: EthereumCurrency[],
  atomexProtocolOptions: typeof mainnetEthereumWeb3AtomexProtocolV1Options | typeof testnetEthereumWeb3AtomexProtocolV1Options
): Record<EthereumCurrency['id'], AtomexCurrencyOptions> => {
  const result: Record<EthereumCurrency['id'], AtomexCurrencyOptions> = {};
  const currenciesMap = currencies.reduce<Record<EthereumCurrency['id'], EthereumCurrency>>(
    (obj, currency) => {
      obj[currency.id] = currency;

      return obj;
    },
    {}
  );

  for (const currencyOptions of Object.values(atomexProtocolOptions)) {
    const currency = currenciesMap[currencyOptions.currencyId];
    if (!currency)
      throw new Error(`The ${currencyOptions.currencyId} currency not found`);

    if (currency.type === 'native')
      result[currency.id] = {
        atomexProtocol: new EthereumWeb3AtomexProtocolV1(
          atomexContext.atomexNetwork,
          atomexContext.providers.currenciesProvider,
          currencyOptions
        )
      };
  }

  return result;
};

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
      currencyOptions: createCurrencyOptions(atomexContext, ethereumMainnetCurrencies, mainnetEthereumWeb3AtomexProtocolV1Options),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    },
    testnet: {
      rpcUrl: testNetRpcUrl,
      currencies: ethereumTestnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, ethereumTestnetCurrencies, testnetEthereumWeb3AtomexProtocolV1Options),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
  };

  return ethereumOptions;
};
