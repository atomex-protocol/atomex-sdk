import type { DeepReadonly } from '../core/index';
import type { AuthorizationManagerDefaultComponentOptions } from './atomexComponents';
import { ExchangeServiceDefaultComponentOptions } from './atomexComponents/exchangeService';
declare type AtomexConfigNetworkSection = DeepReadonly<{
    authorization: AuthorizationManagerDefaultComponentOptions;
    exchange: ExchangeServiceDefaultComponentOptions;
}>;
export declare type AtomexConfig = DeepReadonly<{
    mainnet: AtomexConfigNetworkSection;
    testnet: AtomexConfigNetworkSection;
}>;
export declare const config: AtomexConfig;
export {};
