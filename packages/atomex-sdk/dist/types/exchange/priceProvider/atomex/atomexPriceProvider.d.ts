import type BigNumber from 'bignumber.js';
import type { Currency } from '../../../common/index';
import type { ExchangeService } from '../../exchangeService';
import type { PriceProvider } from '../priceProvider';
export declare class AtomexPriceProvider implements PriceProvider {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id']): Promise<BigNumber | undefined>;
    private getMiddlePrice;
}
