import type { AtomexBlockchainNetworkOptions, AtomexContext, AtomexCurrencyOptions } from '../../atomex/index';
import { FA12TezosTaquitoAtomexProtocolV1, FA2TezosTaquitoAtomexProtocolV1, TezosTaquitoAtomexProtocolV1 } from '../atomexProtocol';
import { TezosBalancesProvider } from '../balancesProviders/index';
import { TaquitoBlockchainToolkitProvider } from '../blockchainToolkitProviders/index';
import type { TezosCurrency } from '../models';
import { TezosSwapTransactionsProvider } from '../swapTransactionsProviders/index';
import { mainnetTezosTaquitoAtomexProtocolV1Options, testnetTezosTaquitoAtomexProtocolV1Options } from './atomexProtocol';
import { tezosMainnetCurrencies, tezosTestnetCurrencies } from './currencies';

type AtomexProtocolOptions = typeof mainnetTezosTaquitoAtomexProtocolV1Options | typeof testnetTezosTaquitoAtomexProtocolV1Options;

const createAtomexProtocol = (
  atomexContext: AtomexContext,
  currency: TezosCurrency,
  atomexProtocolOptions: AtomexProtocolOptions[keyof AtomexProtocolOptions]
) => {
  switch (currency.type) {
    case 'native':
      return new TezosTaquitoAtomexProtocolV1(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager
      );
    case 'fa1.2':
      return new FA12TezosTaquitoAtomexProtocolV1(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager
      );
    case 'fa2':
      return new FA2TezosTaquitoAtomexProtocolV1(
        atomexContext.atomexNetwork,
        atomexProtocolOptions,
        atomexContext.providers.blockchainProvider,
        atomexContext.managers.walletsManager
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
  const balancesProvider = new TezosBalancesProvider();
  const swapTransactionsProvider = new TezosSwapTransactionsProvider();

  const tezosOptions: AtomexBlockchainNetworkOptions = atomexContext.atomexNetwork === 'mainnet'
    ? {
      rpcUrl: mainnetRpcUrl,
      currencies: tezosMainnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, tezosMainnetCurrencies, mainnetTezosTaquitoAtomexProtocolV1Options),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(mainnetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    }
    : {
      rpcUrl: testNetRpcUrl,
      currencies: tezosTestnetCurrencies,
      currencyOptions: createCurrencyOptions(atomexContext, tezosTestnetCurrencies, testnetTezosTaquitoAtomexProtocolV1Options),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(testNetRpcUrl),
      balancesProvider,
      swapTransactionsProvider,
    };

  return tezosOptions;
};
