import type { AtomexBlockchainNetworkOptions, AtomexContext, AtomexCurrencyOptions } from '../../atomex/index';
import { FA12TezosTaquitoAtomexProtocolMultiChain, FA2TezosTaquitoAtomexProtocolMultiChain, TezosTaquitoAtomexProtocolMultiChain } from '../atomexProtocol';
import { TzktBalancesProvider } from '../balancesProviders/index';
import { TaquitoBlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import type { TezosCurrency } from '../models';
import { TezosSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetTezosTaquitoAtomexProtocolMultiChainOptions, testnetTezosTaquitoAtomexProtocolMultiChainOptions } from './atomexProtocol';
import { tezosMainnetCurrencies, tezosTestnetCurrencies } from './currencies';

type AtomexProtocolOptions = typeof mainnetTezosTaquitoAtomexProtocolMultiChainOptions | typeof testnetTezosTaquitoAtomexProtocolMultiChainOptions;

const createAtomexProtocol = (
  atomexContext: AtomexContext,
  currency: TezosCurrency,
  atomexProtocolOptions: AtomexProtocolOptions[keyof AtomexProtocolOptions]
) => {
  switch (currency.type) {
    case 'native':
      return new TezosTaquitoAtomexProtocolMultiChain(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager,
        atomexContext.managers.priceManager
      );
    case 'fa1.2':
      return new FA12TezosTaquitoAtomexProtocolMultiChain(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager,
        atomexContext.managers.priceManager
      );
    case 'fa2':
      return new FA2TezosTaquitoAtomexProtocolMultiChain(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager,
        atomexContext.managers.priceManager
      );
    default:
      throw new Error(`Unknown Tezos currency: ${(currency as TezosCurrency).id}`);
  }
};

const createCurrencyOptions = (
  atomexContext: AtomexContext,
  currencies: TezosCurrency[],
  atomexProtocolOptions: AtomexProtocolOptions
): Record<TezosCurrency['id'], AtomexCurrencyOptions> => {
  const result: Record<TezosCurrency['id'], AtomexCurrencyOptions> = {};
  const currenciesMap = currencies.reduce<Record<TezosCurrency['id'], TezosCurrency>>(
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

export const createDefaultTezosBlockchainOptions = (atomexContext: AtomexContext): AtomexBlockchainNetworkOptions => {
  const mainnetRpcUrl = 'https://rpc.tzkt.io/mainnet/';
  const testNetRpcUrl = 'https://rpc.tzkt.io/ithacanet/';
  const swapTransactionsProvider = new TezosSwapTransactionsProvider();

  const tezosOptions: AtomexBlockchainNetworkOptions = atomexContext.atomexNetwork === 'mainnet'
    ? {
      rpcUrl: mainnetRpcUrl,
      currencies: tezosMainnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, tezosMainnetCurrencies, mainnetTezosTaquitoAtomexProtocolMultiChainOptions),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider: new TzktBalancesProvider('https://api.mainnet.tzkt.io/'),
      swapTransactionsProvider,
    }
    : {
      rpcUrl: testNetRpcUrl,
      currencies: tezosTestnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, tezosTestnetCurrencies, testnetTezosTaquitoAtomexProtocolMultiChainOptions),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider: new TzktBalancesProvider('https://api.ghostnet.tzkt.io/'),
      swapTransactionsProvider,
    };

  return tezosOptions;
};
