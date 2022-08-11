import { TezosToolkit } from '@taquito/taquito';
import type { BlockchainToolkitProvider } from '../../blockchain/index';
export declare class TaquitoBlockchainToolkitProvider implements BlockchainToolkitProvider {
    protected readonly rpcUrl: string;
    static readonly BLOCKCHAIN = "tezos";
    readonly toolkitId = "taquito";
    protected toolkit: TezosToolkit | undefined;
    constructor(rpcUrl: string);
    getReadonlyToolkit(blockchain?: string): Promise<TezosToolkit | undefined>;
}
