import { Atomex, AtomexContext } from '../atomex/index';
import type { AtomexBlockchainNetworkOptions } from '../atomex/models/index';
import type { AuthorizationManager } from '../authorization/index';
import { AtomexBlockchainProvider, WalletsManager } from '../blockchain/index';
import type { DeepReadonly } from '../core/index';
import { createDefaultEthereumBlockchainOptions } from '../ethereum/index';
import {
  AtomexRatesService, BinanceRatesService, ExchangeManager, InMemoryExchangeSymbolsProvider,
  InMemoryOrderBookProvider, KrakenRatesService, PriceManager, MixedPriceManager, RatesService
} from '../exchange/index';
import { SwapManager } from '../swaps/swapManager';
import { createDefaultTezosBlockchainOptions } from '../tezos/index';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
import { createDefaultExchangeService } from './atomexComponents/exchangeService';
import { AuthorizationManagerDefaultComponentOptions, createDefaultAuthorizationManager } from './atomexComponents/index';
import { config } from './atomexConfig';
import type { ControlledAtomexContext } from './controlledAtomexContext';
import type { CustomAtomexComponentFactory } from './customAtomexComponentFactory';

export class AtomexBuilder {
  protected customAuthorizationManagerFactory?: CustomAtomexComponentFactory<AuthorizationManager, AuthorizationManagerDefaultComponentOptions>;
  protected customWalletsManagerFactory?: CustomAtomexComponentFactory<WalletsManager>;
  protected customExchangeManagerFactory?: CustomAtomexComponentFactory<ExchangeManager>;

  private get controlledAtomexContext(): ControlledAtomexContext {
    return this.atomexContext;
  }

  constructor(
    protected readonly options: DeepReadonly<AtomexBuilderOptions>,
    protected readonly atomexContext: AtomexContext = new AtomexContext(options.atomexNetwork)
  ) {
  }

  useAuthorizationManager(customAuthorizationManagerFactory: NonNullable<AtomexBuilder['customAuthorizationManagerFactory']>): AtomexBuilder {
    this.customAuthorizationManagerFactory = customAuthorizationManagerFactory;
    return this;
  }

  useWalletsManager(customWalletsManagerFactory: NonNullable<AtomexBuilder['customWalletsManagerFactory']>): AtomexBuilder {
    this.customWalletsManagerFactory = customWalletsManagerFactory;
    return this;
  }

  useExchangeManager(customExchangeManagerFactory: NonNullable<AtomexBuilder['customExchangeManagerFactory']>): AtomexBuilder {
    this.customExchangeManagerFactory = customExchangeManagerFactory;
    return this;
  }

  build(): Atomex {
    const blockchainProvider = new AtomexBlockchainProvider();
    this.controlledAtomexContext.providers.blockchainProvider = blockchainProvider;
    this.controlledAtomexContext.providers.currenciesProvider = blockchainProvider;
    this.controlledAtomexContext.providers.exchangeSymbolsProvider = this.createExchangeSymbolsProvider();
    this.controlledAtomexContext.providers.orderBookProvider = this.createOrderBookProvider();
    this.controlledAtomexContext.managers.walletsManager = this.createWalletsManager();
    this.controlledAtomexContext.managers.authorizationManager = this.createAuthorizationManager();
    const atomexClient = this.createDefaultExchangeService();
    this.controlledAtomexContext.services.exchangeService = atomexClient;
    this.controlledAtomexContext.services.swapService = atomexClient;
    this.controlledAtomexContext.managers.exchangeManager = this.createExchangeManager();
    this.controlledAtomexContext.managers.swapManager = this.createSwapManager();
    this.controlledAtomexContext.managers.priceManager = this.createPriceManager();
    const blockchains = this.createDefaultBlockchainOptions();

    return new Atomex({
      atomexContext: this.atomexContext,
      managers: {
        walletsManager: this.atomexContext.managers.walletsManager,
        authorizationManager: this.atomexContext.managers.authorizationManager,
        exchangeManager: this.atomexContext.managers.exchangeManager,
        swapManager: this.atomexContext.managers.swapManager
      },
      blockchains
    });
  }

  protected createExchangeSymbolsProvider() {
    return new InMemoryExchangeSymbolsProvider();
  }

  protected createOrderBookProvider() {
    return new InMemoryOrderBookProvider();
  }

  protected createAuthorizationManager() {
    const defaultAuthorizationManagerOptions = config[this.atomexContext.atomexNetwork].authorization;

    return this.customAuthorizationManagerFactory
      ? this.customAuthorizationManagerFactory(this.atomexContext, defaultAuthorizationManagerOptions, this.options)
      : createDefaultAuthorizationManager(this.atomexContext, defaultAuthorizationManagerOptions, this.options);
  }

  protected createWalletsManager() {
    return this.customWalletsManagerFactory
      ? this.customWalletsManagerFactory(this.atomexContext, this.options)
      : new WalletsManager(this.atomexContext.atomexNetwork);
  }

  protected createDefaultExchangeService() {
    const defaultExchangeManagerOptions = config[this.atomexContext.atomexNetwork].exchange;

    return createDefaultExchangeService(this.atomexContext, defaultExchangeManagerOptions);
  }

  protected createExchangeManager() {
    return this.customExchangeManagerFactory
      ? this.customExchangeManagerFactory(this.atomexContext, this.options)
      : new ExchangeManager({
        exchangeService: this.atomexContext.services.exchangeService,
        symbolsProvider: this.atomexContext.providers.exchangeSymbolsProvider,
        orderBookProvider: this.atomexContext.providers.orderBookProvider
      });
  }

  protected createSwapManager() {
    return new SwapManager(this.atomexContext.services.swapService);
  }

  protected createDefaultBlockchainOptions(): Record<string, AtomexBlockchainNetworkOptions> {
    return {
      tezos: createDefaultTezosBlockchainOptions(this.atomexContext),
      ethereum: createDefaultEthereumBlockchainOptions(this.atomexContext)
    };
  }

  protected createPriceManager(): PriceManager {
    return new MixedPriceManager(new Map<string, RatesService>([
      ['binance', new BinanceRatesService()],
      ['kraken', new KrakenRatesService()],
      ['atomex', new AtomexRatesService(this.atomexContext.services.exchangeService)]
    ]));
  }
}
