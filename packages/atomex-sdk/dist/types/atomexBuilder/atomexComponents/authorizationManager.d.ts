import type { AtomexContext } from '../../atomex/index';
import { AuthorizationManager, AuthMessage } from '../../authorization/index';
import { type PreDefinedStoreStrategyName } from '../../browser/index';
import type { DeepReadonly } from '../../core/index';
import type { AtomexBuilderOptions } from '../atomexBuilderOptions';
export declare type RequiredAuthorizationManagerDefaultComponentOptions = Pick<AuthorizationManagerDefaultComponentOptions, never>;
export declare type AuthorizationManagerDefaultComponentOptions = DeepReadonly<{
    authorizationBaseUrl: string;
    authMessage?: AuthMessage;
    store: {
        node: {};
        browser: {
            storeStrategy: PreDefinedStoreStrategyName;
        };
    };
}>;
export declare const createDefaultAuthorizationManager: (atomexContext: AtomexContext, options: AuthorizationManagerDefaultComponentOptions, _builderOptions: DeepReadonly<AtomexBuilderOptions>) => AuthorizationManager;
