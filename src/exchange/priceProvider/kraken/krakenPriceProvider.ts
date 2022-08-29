import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import { HttpClient } from '../../../core';
import type { PriceProvider } from '../priceProvider';
import type { KrakenRatesDto } from './dtos';

export class KrakenPriceProvider implements PriceProvider {
  private static readonly baseUrl = 'https://api.kraken.com';

  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(KrakenPriceProvider.baseUrl);
  }

  async getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined> {
    const baseCurrency = this.getSymbol(baseCurrencyOrSymbol);
    const quoteCurrency = this.getSymbol(quoteCurrencyOrSymbol);

    const pairSymbol = `${baseCurrency}${quoteCurrency}`;
    const urlPath = `/0/public/Ticker?pair=${pairSymbol}`;
    const responseDto = await this.httpClient.request<KrakenRatesDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto);
  }

  private getSymbol(currencyOrSymbol: Currency | string): string {
    const symbol = typeof currencyOrSymbol === 'string' ? currencyOrSymbol : currencyOrSymbol.symbol;

    return symbol.toUpperCase();
  }

  private mapRatesDtoToPrice(dto: KrakenRatesDto): BigNumber | undefined {
    if (dto.error.length)
      return undefined;

    const symbol = Object.keys(dto.result)[0];
    const tickerInfo = symbol ? dto.result[symbol] : undefined;
    if (!tickerInfo)
      return undefined;

    return new BigNumber(tickerInfo.c[0]);
  }
}
