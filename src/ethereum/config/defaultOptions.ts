import type { AtomexContext, AtomexBlockchainOptions, AtomexCurrencyOptions } from '../../atomex/index';
import { Web3BlockchainToolkitProvider } from '../../evm/index';
import { EthereumWeb3AtomexProtocolV1 } from '../atomexProtocol/index';
import { EthereumBalancesProvider } from '../balancesProviders/index';
import type { EthereumCurrency } from '../models';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetEthereumWeb3AtomexProtocolV1Options, testnetEthereumWeb3AtomexProtocolV1Options } from './atomexProtocol';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

type AtomexProtocolOptions = typeof mainnetEthereumWeb3AtomexProtocolV1Options | typeof testnetEthereumWeb3AtomexProtocolV1Options;

const createAtomexProtocol = (
  atomexContext: AtomexContext,
  currency: EthereumCurrency,
  atomexProtocolOptions: AtomexProtocolOptions[keyof AtomexProtocolOptions]
) => {
  if (currency.type === 'native')
    return new EthereumWeb3AtomexProtocolV1(
      atomexContext.atomexNetwork,
      atomexContext.providers.currenciesProvider,
      atomexProtocolOptions
    );

  throw new Error(`Unknown Ethereum currency: ${currency.id}`);
};

const createCurrencyOptions = (
  atomexContext: AtomexContext,
  currencies: EthereumCurrency[],
  atomexProtocolOptions: AtomexProtocolOptions
): Record<EthereumCurrency['id'], AtomexCurrencyOptions> => {
  const result: Record<EthereumCurrency['id'], AtomexCurrencyOptions> = {};
  const currenciesMap = currencies.reduce<Record<EthereumCurrency['id'], EthereumCurrency>>(
    (obj, currency) => {
      obj[currency.id] = currency;

      return obj;
    },
    {}
  );

  for (const options of Object.values(atomexProtocolOptions)) {
    const currency = currenciesMap[options.currencyId];
    if (!currency)
      throw new Error(`The ${options.currencyId} currency not found`);

    result[currency.id] = {
      atomexProtocol: createAtomexProtocol(atomexContext, currency, options)
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
