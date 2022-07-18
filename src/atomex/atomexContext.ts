import type { AuthorizationManager } from '../authorization/index';
import type { SignersManager } from '../blockchain/index';
import type { ExchangeManager, ExchangeService } from '../exchange';
import type { AtomexNetwork } from '../index';

export class AtomexContext {
  private static idCounter = 0;

  readonly id: number;

  readonly managers: AtomexContextManagersSection;
  readonly services: AtomexContextServicesSection;

  constructor(readonly atomexNetwork: AtomexNetwork) {
    this.id = AtomexContext.idCounter++;

    this.managers = new AtomexContextManagersSection(this);
    this.services = new AtomexContextServicesSection(this);
  }
}

class AtomexContextManagersSection {
  private _signersManager: SignersManager | undefined;
  private _authorizationManager: AuthorizationManager | undefined;
  private _exchangeManager: ExchangeManager | undefined;

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
}

class AtomexContextServicesSection {
  private _exchangeService: ExchangeService | undefined;

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
