import type { SwapTransactionsProvider } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { ExchangeService, ExchangeServiceEvents } from '../exchange/index';
import { SwapServiceEvents } from '../swaps/SwapService';
import type { SwapService } from '../swaps/index';

export interface AtomexClient extends ExchangeService, SwapService, SwapTransactionsProvider {
  readonly events: SwapServiceEvents & ExchangeServiceEvents;

  readonly atomexNetwork: AtomexNetwork;
}
