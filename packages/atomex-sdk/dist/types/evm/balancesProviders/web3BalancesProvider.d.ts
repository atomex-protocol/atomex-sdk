import BigNumber from 'bignumber.js';
import type { AtomexBlockchainProvider, BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../common/index';
export declare class Web3BalancesProvider implements BalancesProvider {
    private readonly blockchainProvider;
    constructor(blockchainProvider: AtomexBlockchainProvider);
    getBalance(address: string, currency: Currency): Promise<BigNumber>;
    private getNativeTokenBalance;
    private getTokenBalance;
}
