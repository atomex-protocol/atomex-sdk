import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../common/index';
import type { ExchangeService } from '../../exchangeService';
import type { Quote } from '../../models/index';
import type { PriceProvider } from '../priceProvider';

export class AtomexPriceProvider implements PriceProvider {
  constructor(
    private readonly exchangeService: ExchangeService
  ) { }

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const symbol = `${baseCurrency}/${quoteCurrency}`;
    const quote = (await this.exchangeService.getTopOfBook([{ from: baseCurrency, to: quoteCurrency }]))?.[0];

    return quote && quote.symbol == symbol ? this.getMiddlePrice(quote) : undefined;
  }

  private getMiddlePrice(quote: Quote): BigNumber {
    return quote.ask.plus(quote.bid).div(2);
  }
}
