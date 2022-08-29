import BigNumber from 'bignumber.js';
import type { Currency } from '../../../common';
import type { PriceProvider } from '../priceProvider';
export declare class BinancePriceProvider implements PriceProvider {
    private static readonly baseUrl;
    private static readonly priceUrlPath;
    private readonly httpClient;
    private _allSymbols;
    constructor();
    getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined>;
    private getSymbol;
    private mapRatesDtoToPrice;
    private getAllSymbols;
    private requestAllSymbols;
}
