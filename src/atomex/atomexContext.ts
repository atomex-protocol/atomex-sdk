import type { AuthorizationManager } from '../authorization/index';
import type { AtomexBlockchainProvider } from '../blockchain/atomexBlockchainProvider';
import type { SignersManager } from '../blockchain/index';
import type { ExchangeManager, ExchangeService } from '../exchange';
import type { AtomexNetwork } from '../index';
import type { SwapManager, SwapService } from '../swaps/index';

export class AtomexContext {
  private static idCounter = 0;

  readonly id: number;

  readonly managers: AtomexContextManagersSection;
  readonly services: AtomexContextServicesSection;
  readonly providers: AtomexContextProvidersSection;

  constructor(readonly atomexNetwork: AtomexNetwork) {
    this.id = AtomexContext.idCounter++;

    this.managers = new AtomexContextManagersSection(this);
    this.services = new AtomexContextServicesSection(this);
    this.providers = new AtomexContextProvidersSection(this);
  }
}

class AtomexContextManagersSection {
  private _signersManager: SignersManager | undefined;
  private _authorizationManager: AuthorizationManager | undefined;
  private _exchangeManager: ExchangeManager | undefined;
  private _swapManager: SwapManager | undefined;

  constructor(readonly context: AtomexContext) {
  }

  get signersManager(): SignersManager {
    if (!this._signersManager)
      throw new AtomexComponentNotResolvedError('managers.signersManager');

    return this._signersManager;
  }

  private set signersManager(signersManager: SignersManager) {
    this._signersManager = signersManager;
  }

  get authorizationManager(): AuthorizationManager {
    if (!this._authorizationManager)
      throw new AtomexComponentNotResolvedError('managers.authorizationManager');

    return this._authorizationManager;
  }

  private set authorizationManager(authorizationManager: AuthorizationManager) {
    this._authorizationManager = authorizationManager;
  }

  get exchangeManager(): ExchangeManager {
    if (!this._exchangeManager)
      throw new AtomexComponentNotResolvedError('managers.exchangeManager');

    return this._exchangeManager;
  }

  private set exchangeManager(exchangeManager: ExchangeManager) {
    this._exchangeManager = exchangeManager;
  }

  get swapManager(): SwapManager {
    if (!this._swapManager)
      throw new AtomexComponentNotResolvedError('managers.swapManager');

    return this._swapManager;
  }

  private set swapManager(swapManager: SwapManager) {
    this._swapManager = swapManager;
  }
}

class AtomexContextServicesSection {
  private _exchangeService: ExchangeService | undefined;
  private _swapService: SwapService | undefined;

  constructor(readonly context: AtomexContext) {
  }

  get exchangeService(): ExchangeService {
    if (!this._exchangeService)
      throw new AtomexComponentNotResolvedError('services.exchangeService');

    return this._exchangeService;
  }

  private set exchangeService(exchangeService: ExchangeService) {
    this._exchangeService = exchangeService;
  }

  get swapService(): SwapService {
    if (!this._swapService)
      throw new AtomexComponentNotResolvedError('services.swapService');

    return this._swapService;
  }

  private set swapService(swapService: SwapService) {
    this._swapService = swapService;
  }
}

class AtomexContextProvidersSection {
  private _blockchainProvider: AtomexBlockchainProvider | undefined;

  constructor(readonly context: AtomexContext) {
  }

  get blockchainProvider(): AtomexBlockchainProvider {
    if (!this._blockchainProvider)
      throw new AtomexComponentNotResolvedError('providers.blockchainProvider');

    return this._blockchainProvider;
  }

  private set blockchainProvider(blockchainProvider: AtomexBlockchainProvider) {
    this._blockchainProvider = blockchainProvider;
  }
}

export class AtomexComponentNotResolvedError extends Error {
  readonly name: string;
  readonly componentName: string;

  constructor(componentName: string) {
    super(AtomexComponentNotResolvedError.getMessage(componentName));

    this.componentName = componentName;
    this.name = this.constructor.name;
  }

  private static getMessage(componentName: string) {
    return `Atomex "${componentName}" component has not resolved yet`;
  }
}
