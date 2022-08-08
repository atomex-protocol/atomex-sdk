import type { AtomexContext } from '../../atomex/index';
import { MixedApiAtomexClient, RestAtomexClient, WebSocketAtomexClient } from '../../clients/index';
import type { DeepReadonly } from '../../core/index';

export type ExchangeServiceDefaultComponentOptions = DeepReadonly<{
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
}>;

export const createDefaultExchangeService = (
  atomexContext: AtomexContext,
  options: ExchangeServiceDefaultComponentOptions
) => {
  return new MixedApiAtomexClient(
    atomexContext.atomexNetwork,
    new RestAtomexClient({
      atomexNetwork: atomexContext.atomexNetwork,
      authorizationManager: atomexContext.managers.authorizationManager,
      currenciesProvider: atomexContext.providers.currenciesProvider,
      exchangeSymbolsProvider: atomexContext.providers.exchangeSymbolsProvider,
      apiBaseUrl: options.apiBaseUrl,
    }),
    new WebSocketAtomexClient({
      atomexNetwork: atomexContext.atomexNetwork,
      authorizationManager: atomexContext.managers.authorizationManager,
      currenciesProvider: atomexContext.providers.currenciesProvider,
      exchangeSymbolsProvider: atomexContext.providers.exchangeSymbolsProvider,
      webSocketApiBaseUrl: options.webSocketApiBaseUrl
    })
  );
};
