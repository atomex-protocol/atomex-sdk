import { Atomex, AtomexContext } from '../atomex/index';
import { AuthorizationManager } from '../authorization/index';
import { SignersManager } from '../blockchain/signersManager';
import type { DeepReadonly } from '../core/index';
import { ExchangeManager } from '../exchange/exchangeManager';
import { SwapManager } from '../swaps/swapManager';
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
    this.controlledAtomexContext.managers.signersManager = this.createSignersManager();
    this.controlledAtomexContext.managers.authorizationManager = this.createAuthorizationManager();
    const atomexClient = this.createDefaultExchangeService();
    this.controlledAtomexContext.services.exchangeService = atomexClient;
    this.controlledAtomexContext.services.swapService = atomexClient;
    this.controlledAtomexContext.managers.exchangeManager = this.createExchangeManager();
    this.controlledAtomexContext.managers.swapManager = this.createSwapManager();

    return new Atomex({
      atomexContext: this.atomexContext,
      managers: {
        signersManager: this.atomexContext.managers.signersManager,
        authorizationManager: this.atomexContext.managers.authorizationManager,
        exchangeManager: this.atomexContext.managers.exchangeManager,
        swapManager: this.atomexContext.managers.swapManager
      }
    });
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
      : new ExchangeManager(this.atomexContext.services.exchangeService);
  }

  protected createSwapManager() {
    return new SwapManager(this.atomexContext.services.swapService);
  }
}
