import BigNumber from 'bignumber.js';
import type { Currency } from '../../../common';
import type { PriceProvider } from '../priceProvider';
export declare class KrakenPriceProvider implements PriceProvider {
    private static readonly baseUrl;
    private readonly httpClient;
    constructor();
    getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined>;
    private getSymbol;
    private mapRatesDtoToPrice;
}
