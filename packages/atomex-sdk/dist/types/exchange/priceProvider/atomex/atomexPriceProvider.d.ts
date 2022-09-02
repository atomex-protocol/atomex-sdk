import type BigNumber from 'bignumber.js';
import { Currency } from '../../../common/index';
import type { ExchangeManager } from '../../exchangeManager';
import type { PriceProvider } from '../priceProvider';
export declare class AtomexPriceProvider implements PriceProvider {
    private readonly exchangeManager;
    constructor(exchangeManager: ExchangeManager);
    getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined>;
    private getSymbol;
    private getMiddlePrice;
}
