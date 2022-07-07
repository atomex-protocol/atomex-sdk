import type Web3 from 'web3';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class Web3EthereumSigner implements Signer {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly web3: Web3;
    static readonly signingAlgorithm = "Keccak256WithEcdsa:Geth2940";
    readonly blockchain = "ethereum";
    constructor(atomexNetwork: AtomexNetwork, web3: Web3);
    getAddress(): Promise<string>;
    getPublicKey(): undefined;
    sign(message: string): Promise<AtomexSignature>;
    protected signInternal(message: string, address: string): Promise<string>;
}
