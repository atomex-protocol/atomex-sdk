import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../common/index';
import type { ExchangeService } from '../../exchangeService';
import type { Quote } from '../../models/index';
import type { PriceProvider } from '../priceProvider';

export class AtomexPriceProvider implements PriceProvider {
  constructor(
    private readonly exchangeService: ExchangeService
  ) { }

  async getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined> {
    const baseCurrency = this.getSymbol(baseCurrencyOrSymbol);
    const quoteCurrency = this.getSymbol(quoteCurrencyOrSymbol);
    const pairSymbol = `${baseCurrency}/${quoteCurrency}`;

    const quote = (await this.exchangeService.getTopOfBook([{ from: baseCurrency, to: quoteCurrency }]))?.[0];

    return quote && quote.symbol === pairSymbol ? this.getMiddlePrice(quote) : undefined;
  }

  private getSymbol(currencyOrSymbol: Currency | string): string {
    return typeof currencyOrSymbol === 'string' ? currencyOrSymbol : currencyOrSymbol.id;
  }

  private getMiddlePrice(quote: Quote): BigNumber {
    return quote.ask.plus(quote.bid).div(2);
  }
}
