import type { AuthorizationManager } from '../authorization/index';
import type { SignersManager } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { ExchangeManager, ExchangeService } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';

export interface ControlledAtomexContext {
  readonly id: number;
  readonly atomexNetwork: AtomexNetwork;

  readonly managers: ControlledAtomexContextManagersSection;
  readonly services: ControlledAtomexContextServicesSection;
}

interface ControlledAtomexContextManagersSection {
  get signersManager(): SignersManager;
  set signersManager(value: SignersManager);

  get authorizationManager(): AuthorizationManager;
  set authorizationManager(value: AuthorizationManager);

  get exchangeManager(): ExchangeManager;
  set exchangeManager(value: ExchangeManager);

  get swapManager(): SwapManager;
  set swapManager(value: SwapManager);
}

interface ControlledAtomexContextServicesSection {
  get exchangeService(): ExchangeService;
  set exchangeService(value: ExchangeService);
  get swapService(): SwapService;
  set swapService(value: SwapService);
}
