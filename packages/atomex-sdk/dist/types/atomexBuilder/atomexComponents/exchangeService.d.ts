import type { AtomexContext } from '../../atomex/index';
import { MixedApiAtomexClient } from '../../clients/index';
import type { DeepReadonly } from '../../core/index';
export declare type ExchangeServiceDefaultComponentOptions = DeepReadonly<{
    apiBaseUrl: string;
    webSocketApiBaseUrl: string;
}>;
export declare const createDefaultExchangeService: (atomexContext: AtomexContext, options: ExchangeServiceDefaultComponentOptions) => MixedApiAtomexClient;
