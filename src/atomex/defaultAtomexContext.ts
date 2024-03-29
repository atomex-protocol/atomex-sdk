import type { AuthorizationManager } from '../authorization/index';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { WalletsManager, AtomexBlockchainProvider } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider, PriceManager } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';
import {
  AtomexComponentNotResolvedError, AtomexContext,
  AtomexContextManagersSection, AtomexContextProvidersSection, AtomexContextServicesSection
} from './atomexContext';

export class DefaultAtomexContext implements AtomexContext {
  private static idCounter = 0;

  readonly id: number;

  readonly managers: DefaultAtomexContextManagersSection;
  readonly services: DefaultAtomexContextServicesSection;
  readonly providers: DefaultAtomexContextProvidersSection;

  constructor(readonly atomexNetwork: AtomexNetwork) {
    this.id = DefaultAtomexContext.idCounter++;

    this.managers = new DefaultAtomexContextManagersSection(this);
    this.services = new DefaultAtomexContextServicesSection(this);
    this.providers = new DefaultAtomexContextProvidersSection(this);
  }
}

class DefaultAtomexContextManagersSection implements AtomexContextManagersSection {
  private _walletsManager: WalletsManager | undefined;
  private _authorizationManager: AuthorizationManager | undefined;
  private _exchangeManager: ExchangeManager | undefined;
  private _swapManager: SwapManager | undefined;
  private _priceManager: PriceManager | undefined;
  private _balanceManager: BalanceManager | undefined;

  constructor(readonly context: DefaultAtomexContext) {
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

  get priceManager(): PriceManager {
    if (!this._priceManager)
      throw new AtomexComponentNotResolvedError('managers.priceManager');

    return this._priceManager;
  }

  private set priceManager(priceManager: PriceManager) {
    this._priceManager = priceManager;
  }

  get balanceManager(): BalanceManager {
    if (!this._balanceManager)
      throw new AtomexComponentNotResolvedError('managers.balanceManager');

    return this._balanceManager;
  }

  private set balanceManager(balanceManager: BalanceManager) {
    this._balanceManager = balanceManager;
  }
}

class DefaultAtomexContextServicesSection implements AtomexContextServicesSection {
  private _exchangeService: ExchangeService | undefined;
  private _swapService: SwapService | undefined;

  constructor(readonly context: DefaultAtomexContext) {
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

class DefaultAtomexContextProvidersSection implements AtomexContextProvidersSection {
  private _blockchainProvider: AtomexBlockchainProvider | undefined;
  private _currenciesProvider: CurrenciesProvider | undefined;
  private _exchangeSymbolsProvider: ManagedExchangeSymbolsProvider | undefined;
  private _orderBookProvider: ManagedOrderBookProvider | undefined;

  constructor(readonly context: DefaultAtomexContext) {
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
}
