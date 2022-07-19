import { AtomexContext } from '../../atomex/index';
import { MixedApiAtomexClient, RestAtomexClient, WebSocketAtomexClient } from '../../clients/index';
import { DeepReadonly } from '../../core/index';

export type ExchangeServiceDefaultComponentOptions = DeepReadonly<{
  apiBaseUrl: string;
}>;

export const createDefaultExchangeService = (
  atomexContext: AtomexContext,
  options: ExchangeServiceDefaultComponentOptions
) => {
  return new MixedApiAtomexClient(
    atomexContext.atomexNetwork,
    new RestAtomexClient({
      atomexNetwork: atomexContext.atomexNetwork,
      apiBaseUrl: options.apiBaseUrl,
      authorizationManager: atomexContext.managers.authorizationManager,
    }),
    new WebSocketAtomexClient(atomexContext.atomexNetwork, atomexContext.managers.authorizationManager)
  );
};
