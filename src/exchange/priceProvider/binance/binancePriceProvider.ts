import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import { HttpClient } from '../../../core';
import type { PriceProvider } from '../priceProvider';
import type { BinanceErrorDto, BinanceRatesDto } from './dtos';
import { isErrorDto } from './utils';

export class BinancePriceProvider implements PriceProvider {
  private static readonly baseUrl = 'https://www.binance.com';
  private static readonly priceUrlPath = '/api/v3/ticker/price';

  private readonly httpClient: HttpClient;
  private _allSymbols: Set<string> | undefined;

  constructor() {
    this.httpClient = new HttpClient(BinancePriceProvider.baseUrl);
  }

  async getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined> {
    const baseCurrency = this.getSymbol(baseCurrencyOrSymbol);
    const quoteCurrency = this.getSymbol(quoteCurrencyOrSymbol);

    const pairSymbol = `${baseCurrency}${quoteCurrency}`;
    const allSymbols = await this.getAllSymbols();
    if (!allSymbols.has(pairSymbol))
      return undefined;

    const urlPath = `${BinancePriceProvider.priceUrlPath}?symbol=${pairSymbol}`;
    const responseDto = await this.httpClient.request<BinanceRatesDto | BinanceErrorDto>({ urlPath }, false);

    return this.mapRatesDtoToPrice(responseDto);
  }

  private getSymbol(currencyOrSymbol: Currency | string): string {
    const symbol = typeof currencyOrSymbol === 'string' ? currencyOrSymbol : currencyOrSymbol.symbol;

    return symbol.toUpperCase();
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
    const urlPath = BinancePriceProvider.priceUrlPath;
    const responseDto = await this.httpClient.request<BinanceRatesDto[]>({ urlPath }, false);

    return responseDto.map(dto => dto.symbol);
  }
}
