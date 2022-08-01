import type { OperationContentsAndResultTransaction } from '@taquito/rpc';
import { TezosHelpers } from './tezos';
import type { InitiateParameters, Network, TezosBasedCurrency } from './types';
/**
 * TZIP-7 Util class for Tezos FA1.2 tokens related Atomex helper functions
 */
export declare class FA12Helpers extends TezosHelpers {
    /**
     * Connects to the supported tezos chain
     *
     * @param network networks supported by atomex, can be either mainnet or testnet
     * @param currency FA1.2 token symbol
     * @param rpc optional rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    static create(network: Network, currency: TezosBasedCurrency, rpcUri?: string): Promise<TezosHelpers>;
    parseInitiateParameters(content: OperationContentsAndResultTransaction): InitiateParameters;
}
