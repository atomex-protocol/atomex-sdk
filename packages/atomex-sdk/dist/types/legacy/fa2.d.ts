import type { OperationContentsAndResultTransaction } from '@taquito/rpc';
import type { Atomex } from '../atomex';
import { TezosHelpers } from './tezos';
import type { InitiateParameters, Network, TezosBasedCurrency } from './types';
export declare class FA2Helpers extends TezosHelpers {
    /**
     * Connects to the supported tezos chain
     *
     * @param newAtomex instance of new Atomex class
     * @param network networks supported by atomex, can be either mainnet or testnet
     * @param currency FA2 token symbol
     * @param rpcUri optional rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    static create(newAtomex: Atomex, network: Network, currency: TezosBasedCurrency, rpcUri?: string): Promise<TezosHelpers>;
    parseInitiateParameters(content: OperationContentsAndResultTransaction): InitiateParameters;
    private getInitiateParams;
}
