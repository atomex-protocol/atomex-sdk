import type BigNumber from 'bignumber.js';
import type { BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../common/index';
export declare class TzktBalancesProvider implements BalancesProvider {
    private readonly httpClient;
    constructor(baseUrl: string);
    getBalance(address: string, currency: Currency): Promise<BigNumber>;
    private getNativeTokenBalance;
    private getTokenBalance;
}
