import type { AtomexContext } from '../../atomex/index';
import { AuthorizationManager } from '../../authorization/index';
import { LocalStorageAuthorizationManagerStore, type PreDefinedStoreStrategyName } from '../../browser/index';
import type { DeepReadonly } from '../../core/index';
import { InMemoryAuthorizationManagerStore } from '../../stores/index';
import type { AtomexBuilderOptions } from '../atomexBuilderOptions';

export type RequiredAuthorizationManagerDefaultComponentOptions = Pick<AuthorizationManagerDefaultComponentOptions, never>;

export type AuthorizationManagerDefaultComponentOptions = DeepReadonly<{
  authorizationBaseUrl: string;
  store: {
    node: {
      //
    },
    browser: {
      storeStrategy: PreDefinedStoreStrategyName;
    }
  }
}>;

export const createDefaultAuthorizationManager = (
  atomexContext: AtomexContext,
  options: AuthorizationManagerDefaultComponentOptions,
  _builderOptions: DeepReadonly<AtomexBuilderOptions>
) => {
  const environment = globalThis.window ? 'browser' : 'node';

  return new AuthorizationManager({
    atomexNetwork: atomexContext.atomexNetwork,
    walletsManager: atomexContext.managers.walletsManager,
    authorizationBaseUrl: options.authorizationBaseUrl,
    store: environment === 'browser'
      ? new LocalStorageAuthorizationManagerStore(options.store.browser.storeStrategy)
      : new InMemoryAuthorizationManagerStore()
  });
};
