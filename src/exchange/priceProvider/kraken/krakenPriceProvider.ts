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

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const symbol = `${baseCurrency}${quoteCurrency}`;
    const urlPath = `/0/public/Ticker?pair=${symbol}`;
    const responseDto = await this.httpClient.request<KrakenRatesDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto);
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
