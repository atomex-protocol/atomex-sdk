import type { AtomexBlockchainNetworkOptions, AtomexContext, AtomexCurrencyOptions } from '../../atomex/index';
import { Web3BlockchainToolkitProvider, Web3BalancesProvider } from '../../evm/index';
import { ERC20EthereumWeb3AtomexProtocolMultiChain, EthereumWeb3AtomexProtocolMultiChain } from '../atomexProtocol/index';
import type { EthereumCurrency } from '../models';
import { EthereumSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetEthereumWeb3AtomexProtocolMultiChainOptions, testnetEthereumWeb3AtomexProtocolMultiChainOptions } from './atomexProtocol';
import { ethereumMainnetCurrencies, ethereumTestnetCurrencies } from './currencies';

type AtomexProtocolOptions = typeof mainnetEthereumWeb3AtomexProtocolMultiChainOptions | typeof testnetEthereumWeb3AtomexProtocolMultiChainOptions;

const createAtomexProtocol = (
  atomexContext: AtomexContext,
  currency: EthereumCurrency,
  atomexProtocolOptions: AtomexProtocolOptions[keyof AtomexProtocolOptions]
) => {
  switch (currency.type) {
    case 'native':
      return new EthereumWeb3AtomexProtocolMultiChain(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager,
        atomexContext.managers.priceManager
      );
    case 'erc-20':
      return new ERC20EthereumWeb3AtomexProtocolMultiChain(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager,
        atomexContext.managers.priceManager
      );
    default:
      throw new Error(`Unknown Ethereum currency: ${(currency as EthereumCurrency).id}`);
  }
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

export const createDefaultEthereumBlockchainOptions = (atomexContext: AtomexContext): AtomexBlockchainNetworkOptions => {
  const blockchain = 'ethereum';
  const mainnetRpcUrl = 'https://mainnet.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf';
  const testNetRpcUrl = 'https://goerli.infura.io/v3/df01d4ef450640a2a48d9af4c2078eaf';

  const balancesProvider = new Web3BalancesProvider(atomexContext.providers.blockchainProvider);
  const swapTransactionsProvider = new EthereumSwapTransactionsProvider();

  const ethereumOptions: AtomexBlockchainNetworkOptions = atomexContext.atomexNetwork === 'mainnet'
    ? {
      rpcUrl: mainnetRpcUrl,
      currencies: ethereumMainnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, ethereumMainnetCurrencies, mainnetEthereumWeb3AtomexProtocolMultiChainOptions),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
    : {
      rpcUrl: testNetRpcUrl,
      currencies: ethereumTestnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, ethereumTestnetCurrencies, testnetEthereumWeb3AtomexProtocolMultiChainOptions),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider(blockchain, testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    };

  return ethereumOptions;
};
