import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class InMemoryTezosWallet implements BlockchainWallet<TezosToolkit> {
    readonly atomexNetwork: AtomexNetwork;
    readonly id = "taquito";
    readonly toolkit: TezosToolkit;
    protected readonly internalInMemorySigner: InMemorySigner;
    constructor(atomexNetwork: AtomexNetwork, secretKey: string, rpcUrl: string);
    getBlockchain(): string | Promise<string>;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string>;
    sign(message: string): Promise<AtomexSignature>;
}
