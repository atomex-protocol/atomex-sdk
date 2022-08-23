import type { AuthorizationManager } from '../authorization/index';
import type { WalletsManager, AtomexBlockchainProvider } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider, RatesProvider } from '../exchange/index';
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
  private _walletsManager: WalletsManager | undefined;
  private _authorizationManager: AuthorizationManager | undefined;
  private _exchangeManager: ExchangeManager | undefined;
  private _swapManager: SwapManager | undefined;

  constructor(readonly context: AtomexContext) {
  }

  get walletsManager(): WalletsManager {
    if (!this._walletsManager)
      throw new AtomexComponentNotResolvedError('managers.walletsManager');

    return this._walletsManager;
  }

  private set walletsManager(walletsManager: WalletsManager) {
    this._walletsManager = walletsManager;
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
  private _currenciesProvider: CurrenciesProvider | undefined;
  private _exchangeSymbolsProvider: ManagedExchangeSymbolsProvider | undefined;
  private _orderBookProvider: ManagedOrderBookProvider | undefined;
  private _ratesProvider: RatesProvider | undefined;

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

  get currenciesProvider(): CurrenciesProvider {
    if (!this._currenciesProvider)
      throw new AtomexComponentNotResolvedError('providers.currenciesProvider');

    return this._currenciesProvider;
  }

  private set currenciesProvider(currenciesProvider: CurrenciesProvider) {
    this._currenciesProvider = currenciesProvider;
  }

  get exchangeSymbolsProvider(): ManagedExchangeSymbolsProvider {
    if (!this._exchangeSymbolsProvider)
      throw new AtomexComponentNotResolvedError('providers.exchangeSymbolsProvider');

    return this._exchangeSymbolsProvider;
  }

  private set exchangeSymbolsProvider(exchangeSymbolsProvider: ManagedExchangeSymbolsProvider) {
    this._exchangeSymbolsProvider = exchangeSymbolsProvider;
  }

  get orderBookProvider(): ManagedOrderBookProvider {
    if (!this._orderBookProvider)
      throw new AtomexComponentNotResolvedError('providers.orderBookProvider');

    return this._orderBookProvider;
  }

  private set orderBookProvider(orderBookProvider: ManagedOrderBookProvider) {
    this._orderBookProvider = orderBookProvider;
  }

  get ratesProvider(): RatesProvider {
    if (!this._ratesProvider)
      throw new AtomexComponentNotResolvedError('providers.ratesProvider');

    return this._ratesProvider;
  }

  private set ratesProvider(ratesProvider: RatesProvider) {
    this._ratesProvider = ratesProvider;
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
