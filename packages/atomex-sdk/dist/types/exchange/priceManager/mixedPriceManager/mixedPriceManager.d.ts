import BigNumber from 'bignumber.js';
import type { PriceProvider } from '../../priceProvider/index';
import type { GetAveragePriceParameters, GetPriceParameters, PriceManager } from '../priceManager';
export declare class MixedPriceManager implements PriceManager {
    private readonly providersMap;
    constructor(providersMap: Map<string, PriceProvider>);
    getAveragePrice({ baseCurrency, quoteCurrency, dataSource }: GetAveragePriceParameters): Promise<BigNumber | undefined>;
    getPrice({ baseCurrency, quoteCurrency, provider, dataSource }: GetPriceParameters): Promise<BigNumber | undefined>;
    getAvailableProviders(): string[];
    dispose(): Promise<void>;
    private getPriceCore;
    private getSelectedProviders;
}
