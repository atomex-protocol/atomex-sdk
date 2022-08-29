import type BigNumber from 'bignumber.js';
import type { Currency } from '../../../common/index';
import type { ExchangeService } from '../../exchangeService';
import type { PriceProvider } from '../priceProvider';
export declare class AtomexPriceProvider implements PriceProvider {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getPrice(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string): Promise<BigNumber | undefined>;
    private getSymbol;
    private getMiddlePrice;
}
