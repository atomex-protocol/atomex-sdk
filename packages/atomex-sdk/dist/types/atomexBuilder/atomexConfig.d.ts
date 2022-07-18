import type { DeepReadonly } from '../core/index';
import type { AuthorizationManagerDefaultComponentOptions } from './atomexComponents';
declare type AtomexConfigNetworkSection = DeepReadonly<{
    authorization: AuthorizationManagerDefaultComponentOptions;
}>;
export declare type AtomexConfig = DeepReadonly<{
    mainnet: AtomexConfigNetworkSection;
    testnet: AtomexConfigNetworkSection;
}>;
export declare const config: AtomexConfig;
export {};
