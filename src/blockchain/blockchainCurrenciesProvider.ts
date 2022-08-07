import type { CurrenciesProvider, Currency } from '../common/index';
import type { AtomexBlockchainProvider } from './atomexBlockchainProvider';

export class BlockchainCurrenciesProvider implements CurrenciesProvider {
  constructor(protected readonly blockchainProvider: AtomexBlockchainProvider) {
  }

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.blockchainProvider.getCurrencyInfo(currencyId)?.currency;
  }
}
