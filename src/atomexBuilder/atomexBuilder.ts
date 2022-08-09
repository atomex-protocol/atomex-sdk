import { Atomex, AtomexContext } from '../atomex/index';
import type { AtomexBlockchainOptions } from '../atomex/models/index';
import type { AuthorizationManager } from '../authorization/index';
import { AtomexBlockchainProvider, SignersManager } from '../blockchain/index';
import type { DeepReadonly } from '../core/index';
import { createDefaultEthereumBlockchainOptions } from '../ethereum/index';
import { ExchangeManager, InMemoryExchangeSymbolsProvider } from '../exchange/index';
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
  protected customSignersManagerFactory?: CustomAtomexComponentFactory<SignersManager>;
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

  useSignersManager(customSignersManagerFactory: NonNullable<AtomexBuilder['customSignersManagerFactory']>): AtomexBuilder {
    this.customSignersManagerFactory = customSignersManagerFactory;
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
    this.controlledAtomexContext.managers.signersManager = this.createSignersManager();
    this.controlledAtomexContext.managers.authorizationManager = this.createAuthorizationManager();
    const atomexClient = this.createDefaultExchangeService();
    this.controlledAtomexContext.services.exchangeService = atomexClient;
    this.controlledAtomexContext.services.swapService = atomexClient;
    this.controlledAtomexContext.managers.exchangeManager = this.createExchangeManager();
    this.controlledAtomexContext.managers.swapManager = this.createSwapManager();
    const blockchains = this.createDefaultBlockchainOptions();

    return new Atomex({
      atomexContext: this.atomexContext,
      managers: {
        signersManager: this.atomexContext.managers.signersManager,
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

  protected createAuthorizationManager() {
    const defaultAuthorizationManagerOptions = config[this.atomexContext.atomexNetwork].authorization;

    return this.customAuthorizationManagerFactory
      ? this.customAuthorizationManagerFactory(this.atomexContext, defaultAuthorizationManagerOptions, this.options)
      : createDefaultAuthorizationManager(this.atomexContext, defaultAuthorizationManagerOptions, this.options);
  }

  protected createSignersManager() {
    return this.customSignersManagerFactory
      ? this.customSignersManagerFactory(this.atomexContext, this.options)
      : new SignersManager(this.atomexContext.atomexNetwork);
  }

  protected createDefaultExchangeService() {
    const defaultExchangeManagerOptions = config[this.atomexContext.atomexNetwork].exchange;

    return createDefaultExchangeService(this.atomexContext, defaultExchangeManagerOptions);
  }

  protected createExchangeManager() {
    return this.customExchangeManagerFactory
      ? this.customExchangeManagerFactory(this.atomexContext, this.options)
      : new ExchangeManager(this.atomexContext.services.exchangeService, this.atomexContext.providers.exchangeSymbolsProvider);
  }

  protected createSwapManager() {
    return new SwapManager(this.atomexContext.services.swapService);
  }

  protected createDefaultBlockchainOptions(): Record<string, AtomexBlockchainOptions> {
    return {
      tezos: createDefaultTezosBlockchainOptions(),
      ethereum: createDefaultEthereumBlockchainOptions()
    };
  }
}
