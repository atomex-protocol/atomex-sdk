import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import { HttpClient } from '../../../core';
import type { RatesProvider } from '../ratesProvider';
import type { KrakenRatesDto } from './dtos';

export class KrakenRatesProvider implements RatesProvider {
  private static readonly baseUrl = 'https://api.kraken.com';

  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(KrakenRatesProvider.baseUrl);
  }

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const symbol = `${baseCurrency}${quoteCurrency}`;
    const urlPath = `/0/public/Ticker?pair=${symbol}`;
    const responseDto = await this.httpClient.request<KrakenRatesDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto, symbol);
  }

  private mapRatesDtoToPrice(dto: KrakenRatesDto, symbol: string): BigNumber | undefined {
    if (dto.error)
      return undefined;

    const tickerInfo = dto.result[symbol];
    if (!tickerInfo)
      return undefined;

    return new BigNumber(tickerInfo.c[0]);
  }
}
