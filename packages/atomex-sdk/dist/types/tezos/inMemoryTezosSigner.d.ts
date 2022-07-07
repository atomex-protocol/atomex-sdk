import { InMemorySigner } from '@taquito/signer';
import type { AtomexSignature, Signer } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
export declare class InMemoryTezosSigner implements Signer {
    readonly atomexNetwork: AtomexNetwork;
    readonly blockchain = "tezos";
    protected readonly internalInMemorySigner: InMemorySigner;
    constructor(atomexNetwork: AtomexNetwork, secretKey: string);
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string>;
    sign(message: string): Promise<AtomexSignature>;
}
