import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class BeaconWalletTezosSigner implements Signer {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly beaconWallet: BeaconWallet;
    readonly blockchain = "tezos";
    constructor(atomexNetwork: AtomexNetwork, beaconWallet: BeaconWallet);
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string | undefined>;
    sign(message: string): Promise<AtomexSignature>;
}
