import type { SwapTransactionsProvider } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { ExchangeService } from '../exchange/index';
import type { Swap } from '../swaps/index';
export interface AtomexClient extends ExchangeService, SwapTransactionsProvider {
    readonly atomexNetwork: AtomexNetwork;
    getSwap(swapId: string): Promise<Swap>;
}
