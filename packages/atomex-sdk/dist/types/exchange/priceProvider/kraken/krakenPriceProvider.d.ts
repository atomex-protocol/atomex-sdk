import BigNumber from 'bignumber.js';
import type { Currency } from '../../../common';
import type { PriceProvider } from '../priceProvider';
export declare class KrakenPriceProvider implements PriceProvider {
    private static readonly baseUrl;
    private readonly httpClient;
    constructor();
    getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined>;
    private mapRatesDtoToPrice;
}
