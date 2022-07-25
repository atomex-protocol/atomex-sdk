import type { SwapTransactionsProvider } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { ExchangeService } from '../exchange/index';
import type { SwapService } from '../swaps/index';

export interface AtomexClient extends ExchangeService, SwapService, SwapTransactionsProvider {
  readonly atomexNetwork: AtomexNetwork;
}
