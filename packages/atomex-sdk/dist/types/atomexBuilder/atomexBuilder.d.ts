import { Atomex, AtomexContext } from '../atomex/index';
import { AuthorizationManager } from '../authorization/index';
import { SignersManager } from '../blockchain/signersManager';
import type { DeepReadonly } from '../core/index';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
import { AuthorizationManagerDefaultComponentOptions } from './atomexComponents/index';
import type { CustomAtomexComponentFactory } from './customAtomexComponentFactory';
export declare class AtomexBuilder {
    readonly options: DeepReadonly<AtomexBuilderOptions>;
    protected readonly atomexContext: AtomexContext;
    protected customAuthorizationManagerFactory?: CustomAtomexComponentFactory<AuthorizationManager, AuthorizationManagerDefaultComponentOptions>;
    protected customSignersManagerFactory?: CustomAtomexComponentFactory<SignersManager>;
    private get controlledAtomexContext();
    constructor(options: DeepReadonly<AtomexBuilderOptions>, atomexContext?: AtomexContext);
    useAuthorizationManager(customAuthorizationManagerFactory: NonNullable<AtomexBuilder['customAuthorizationManagerFactory']>): void;
    useSignersManager(customSignersManagerFactory: NonNullable<AtomexBuilder['customSignersManagerFactory']>): void;
    createAuthorizationManager(): AuthorizationManager;
    createSignersManager(): SignersManager;
    build(): Atomex;
}
