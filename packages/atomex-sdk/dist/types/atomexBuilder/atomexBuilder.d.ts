import { Atomex, AtomexContext } from '../atomex/index';
import { AuthorizationManager } from '../authorization/index';
import { SignersManager } from '../blockchain/signersManager';
import type { DeepReadonly } from '../core/index';
import { ExchangeManager } from '../exchange/exchangeManager';
import { SwapManager } from '../swaps/swapManager';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
import { AuthorizationManagerDefaultComponentOptions } from './atomexComponents/index';
import type { CustomAtomexComponentFactory } from './customAtomexComponentFactory';
export declare class AtomexBuilder {
    protected readonly options: DeepReadonly<AtomexBuilderOptions>;
    protected readonly atomexContext: AtomexContext;
    protected customAuthorizationManagerFactory?: CustomAtomexComponentFactory<AuthorizationManager, AuthorizationManagerDefaultComponentOptions>;
    protected customSignersManagerFactory?: CustomAtomexComponentFactory<SignersManager>;
    protected customExchangeManagerFactory?: CustomAtomexComponentFactory<ExchangeManager>;
    private get controlledAtomexContext();
    constructor(options: DeepReadonly<AtomexBuilderOptions>, atomexContext?: AtomexContext);
    useAuthorizationManager(customAuthorizationManagerFactory: NonNullable<AtomexBuilder['customAuthorizationManagerFactory']>): AtomexBuilder;
    useSignersManager(customSignersManagerFactory: NonNullable<AtomexBuilder['customSignersManagerFactory']>): AtomexBuilder;
    useExchangeManager(customExchangeManagerFactory: NonNullable<AtomexBuilder['customExchangeManagerFactory']>): AtomexBuilder;
    build(): Atomex;
    protected createAuthorizationManager(): AuthorizationManager;
    protected createSignersManager(): SignersManager;
    protected createDefaultExchangeService(): import("../index").MixedApiAtomexClient;
    protected createExchangeManager(): ExchangeManager;
    protected createSwapManager(): SwapManager;
}
