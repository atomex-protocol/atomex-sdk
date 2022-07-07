import type { AtomexNetwork } from '../common/index';
import type { Signer } from './signer';
export declare class SignersManager {
    readonly atomexNetwork: AtomexNetwork;
    private readonly _signers;
    constructor(atomexNetwork: AtomexNetwork);
    protected get signers(): Set<Signer>;
    addSigner(signer: Signer): Promise<Signer>;
    removeSigner(signer: Signer): Promise<boolean>;
    removeSigner(address: string, blockchain?: string): Promise<boolean>;
    findSigner(address: string, blockchain?: string): Promise<Signer | undefined>;
}
