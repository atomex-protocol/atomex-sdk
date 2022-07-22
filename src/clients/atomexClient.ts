import type { SwapTransactionsProvider } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { ExchangeService, SwapsSelector } from '../exchange/index';
import type { Swap } from '../swaps/index';

export interface AtomexClient extends ExchangeService, SwapTransactionsProvider {
  readonly atomexNetwork: AtomexNetwork;

  getSwap(swapId: number): Promise<Swap>;
  getSwaps(selector?: SwapsSelector): Promise<Swap[]>;
}
