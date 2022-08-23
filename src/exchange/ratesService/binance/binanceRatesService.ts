import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import { HttpClient } from '../../../core';
import type { RatesService } from '../ratesService';
import type { BinanceErrorDto, BinanceRatesDto } from './dtos';
import { isErrorDto } from './utils';

export class BinanceRatesService implements RatesService {
  private static readonly baseUrl = 'https://www.binance.com';
  private static readonly priceUrlPath = '/api/v3/ticker/price';

  private readonly httpClient: HttpClient;
  private _allSymbols: Set<string> | undefined;

  constructor() {
    this.httpClient = new HttpClient(BinanceRatesService.baseUrl);
  }

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined> {
    const symbol = `${baseCurrency}${quoteCurrency}`;
    const allSymbols = await this.getAllSymbols();
    if (!allSymbols.has(symbol))
      return undefined;

    const urlPath = `${BinanceRatesService.priceUrlPath}?symbol=${symbol}`;
    const responseDto = await this.httpClient.request<BinanceRatesDto | BinanceErrorDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto);
  }

  private mapRatesDtoToPrice(dto: BinanceRatesDto | BinanceErrorDto): BigNumber | undefined {
    if (isErrorDto(dto))
      return undefined;

    return new BigNumber(dto.price);
  }

  private async getAllSymbols(): Promise<Set<string>> {
    if (!this._allSymbols)
      this._allSymbols = new Set(await this.requestAllSymbols());

    return this._allSymbols;
  }

  private async requestAllSymbols(): Promise<string[]> {
    const urlPath = BinanceRatesService.priceUrlPath;
    const responseDto = await this.httpClient.request<BinanceRatesDto[]>({ urlPath }, false);

    return responseDto.map(dto => dto.symbol);
  }
}
