import Web3 from 'web3';
import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class Web3BlockchainWallet implements BlockchainWallet<Web3> {
    readonly atomexNetwork: AtomexNetwork;
    readonly provider: Web3['currentProvider'];
    static readonly signingAlgorithm = "Keccak256WithEcdsa:Geth2940";
    readonly id = "web3";
    readonly toolkit: Web3;
    constructor(atomexNetwork: AtomexNetwork, provider: Web3['currentProvider']);
    getBlockchain(): Promise<string>;
    getAddress(): Promise<string>;
    getPublicKey(): undefined;
    sign(message: string): Promise<AtomexSignature>;
    protected signInternal(message: string, address: string): Promise<string>;
    static bind(atomex: Atomex, provider: Web3['currentProvider']): Promise<Web3BlockchainWallet>;
}
