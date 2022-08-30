import type { AtomexNetwork, Currency } from '../../../src';
import type { AtomexProtocolMultiChainOptions } from '../../../src/blockchain';
import { MockAtomexProtocolMultiChain } from './mockAtomexProtocolMultiChain';
import { MockBalancesProvider } from './mockBalancesProvider';
import { MockBlockchainToolkitProvider } from './mockBlockchainToolkitProvider';
import type { MockCurrencyBalanceProvider } from './mockCurrencyBalanceProvider';
import { MockSwapTransactionsProvider } from './mockSwapTransactionsProvider';

export interface MockAtomexBlockchainNetworkOptions {
  rpcUrl: string;
  blockchainToolkitProvider: MockBlockchainToolkitProvider;
  balancesProvider: MockBalancesProvider;
  swapTransactionsProvider: MockSwapTransactionsProvider;
  currencies: Currency[];
  currencyOptions: Record<Currency['id'], MockAtomexCurrencyOptions>;
  [name: string | number]: unknown;
}

export interface MockAtomexCurrencyOptions {
  atomexProtocol: MockAtomexProtocolMultiChain;
  currencyBalanceProvider?: MockCurrencyBalanceProvider;
  swapTransactionsProvider?: MockSwapTransactionsProvider;
  [name: string | number]: unknown;
}


const createCurrencyOptions = (
  atomexNetwork: AtomexNetwork,
  currencies: Currency[],
  atomexProtocolOptions: Record<Currency['id'], AtomexProtocolMultiChainOptions>
): Record<Currency['id'], MockAtomexCurrencyOptions> => {
  const result: Record<Currency['id'], MockAtomexCurrencyOptions> = {};
  const currenciesMap = currencies.reduce<Record<Currency['id'], Currency>>(
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
      atomexProtocol: new MockAtomexProtocolMultiChain(atomexNetwork, options),
    };
  }

  return result;
};

export const createMockedBlockchainOptions = ({
  currencies, atomexProtocolOptions, toolkitId, rpcUrl = 'https://testnet.rpc.url', atomexNetwork = 'testnet'
}: {
  currencies: Currency[];
  atomexProtocolOptions: Record<Currency['id'], AtomexProtocolMultiChainOptions>;
  toolkitId: string;
  rpcUrl?: string;
  atomexNetwork?: AtomexNetwork
}): MockAtomexBlockchainNetworkOptions => ({
  rpcUrl,
  currencies,
  currencyOptions: createCurrencyOptions(atomexNetwork, currencies, atomexProtocolOptions),
  blockchainToolkitProvider: new MockBlockchainToolkitProvider(toolkitId),
  balancesProvider: new MockBalancesProvider(),
  swapTransactionsProvider: new MockSwapTransactionsProvider(),
});
