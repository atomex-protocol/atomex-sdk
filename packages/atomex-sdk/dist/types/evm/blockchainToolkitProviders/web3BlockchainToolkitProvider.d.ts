import Web3 from 'web3';
import type { BlockchainToolkitProvider } from '../../blockchain/index';
export declare class Web3BlockchainToolkitProvider implements BlockchainToolkitProvider<Web3> {
    protected readonly blockchain: string;
    protected readonly rpcUrl: string;
    readonly toolkitId = "web3";
    protected toolkit: Web3 | undefined;
    constructor(blockchain: string, rpcUrl: string);
    getReadonlyToolkit(blockchain?: string): Promise<Web3 | undefined>;
}
