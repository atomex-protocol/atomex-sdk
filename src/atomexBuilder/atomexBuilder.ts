import { Atomex, AtomexContext } from '../atomex/index';
import { AuthorizationManager } from '../authorization/index';
import { SignersManager } from '../blockchain/signersManager';
import { MixedApiAtomexClient, RestAtomexClient, WebSocketAtomexClient } from '../clients/index';
import type { DeepReadonly } from '../core/index';
import { ExchangeManager } from '../exchange/exchangeManager';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
import { AuthorizationManagerDefaultComponentOptions, createDefaultAuthorizationManager } from './atomexComponents/index';
import { config } from './atomexConfig';
import type { ControlledAtomexContext } from './controlledAtomexContext';
import type { CustomAtomexComponentFactory } from './customAtomexComponentFactory';

export class AtomexBuilder {
  protected customAuthorizationManagerFactory?: CustomAtomexComponentFactory<AuthorizationManager, AuthorizationManagerDefaultComponentOptions>;
  protected customSignersManagerFactory?: CustomAtomexComponentFactory<SignersManager>;

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

  build(): Atomex {
    this.controlledAtomexContext.managers.signersManager = this.createSignersManager();
    this.controlledAtomexContext.managers.authorizationManager = this.createAuthorizationManager();

    const atomexClient = new MixedApiAtomexClient(
      this.atomexContext.atomexNetwork,
      new RestAtomexClient(this.atomexContext.atomexNetwork, this.controlledAtomexContext.managers.authorizationManager),
      new WebSocketAtomexClient(this.atomexContext.atomexNetwork, this.controlledAtomexContext.managers.authorizationManager)
    );
    this.controlledAtomexContext.services.exchangeService = atomexClient;

    this.controlledAtomexContext.managers.exchangeManager = new ExchangeManager(this.atomexContext.services.exchangeService);

    return new Atomex({
      atomexContext: this.atomexContext,
      managers: {
        signersManager: this.atomexContext.managers.signersManager,
        authorizationManager: this.atomexContext.managers.authorizationManager,
        exchangeManager: this.atomexContext.managers.exchangeManager
      }
    });
  }
}
