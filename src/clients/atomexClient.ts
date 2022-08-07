import type { SwapTransactionsProvider } from '../blockchain/index';
import type { AtomexComponent, AtomexNetwork } from '../common/index';
import type { ExchangeService, ExchangeServiceEvents } from '../exchange/index';
import type { SwapService, SwapServiceEvents } from '../swaps/index';

export interface AtomexClient extends ExchangeService, SwapService, SwapTransactionsProvider, AtomexComponent {
  readonly events: ExchangeServiceEvents & SwapServiceEvents;

  readonly atomexNetwork: AtomexNetwork;
}
