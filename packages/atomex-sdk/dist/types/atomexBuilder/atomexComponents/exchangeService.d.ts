import { AtomexContext } from '../../atomex/index';
import { MixedApiAtomexClient } from '../../clients/index';
import { DeepReadonly } from '../../core/index';
export declare type ExchangeServiceDefaultComponentOptions = DeepReadonly<{
    apiBaseUrl: string;
}>;
export declare const createDefaultExchangeService: (atomexContext: AtomexContext, options: ExchangeServiceDefaultComponentOptions) => MixedApiAtomexClient;
