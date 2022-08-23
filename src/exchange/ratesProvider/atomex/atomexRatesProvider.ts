import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../common/index';
import type { ExchangeService } from '../../exchangeService';
import type { Quote } from '../../models/index';
import type { RatesProvider } from '../ratesProvider';

export class AtomexRatesProvider implements RatesProvider {
  constructor(
    private readonly exchangeService: ExchangeService
  ) { }

  async getPrice(quoteCurrency: Currency['id'], baseCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const quote = (await this.exchangeService.getTopOfBook([{ from: quoteCurrency, to: baseCurrency }]))?.[0];

    return quote ? this.getMiddlePrice(quote) : undefined;
  }

  private getMiddlePrice(quote: Quote): BigNumber {
    return quote.ask.plus(quote.bid).div(2);
  }
}
