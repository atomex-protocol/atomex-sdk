import BigNumber from 'bignumber.js';
import type { Currency } from '../../../common';
import type { PriceProvider } from '../priceProvider';
export declare class BinancePriceProvider implements PriceProvider {
    private static readonly baseUrl;
    private static readonly priceUrlPath;
    private readonly httpClient;
    private _allSymbols;
    constructor();
    getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined>;
    private mapRatesDtoToPrice;
    private getAllSymbols;
    private requestAllSymbols;
}
