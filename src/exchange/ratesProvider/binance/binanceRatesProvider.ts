import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import { HttpClient } from '../../../core';
import type { RatesProvider } from '../ratesProvider';
import type { BinanceErrorDto, BinanceRatesDto } from './dtos';
import { isErrorDto } from './utils';

export class BinanceRatesProvider implements RatesProvider {
  private static readonly baseUrl = 'https://www.binance.com/api';

  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(BinanceRatesProvider.baseUrl);
  }

  async getPrice(quoteCurrency: Currency['id'], baseCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const urlPath = `/v3/ticker/price?symbol=${quoteCurrency}${baseCurrency}`;
    const responseDto = await this.httpClient.request<BinanceRatesDto | BinanceErrorDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto);
  }

  private mapRatesDtoToPrice(dto: BinanceRatesDto | BinanceErrorDto): BigNumber | undefined {
    if (isErrorDto(dto))
      return undefined;

    return new BigNumber(dto.price);
  }
}