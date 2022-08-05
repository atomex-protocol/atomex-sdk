import type BigNumber from 'bignumber.js';
import type { BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../index';
export declare class TezosBalancesProvider implements BalancesProvider {
    getBalance(_address: string, _currency: Currency): Promise<BigNumber>;
}
