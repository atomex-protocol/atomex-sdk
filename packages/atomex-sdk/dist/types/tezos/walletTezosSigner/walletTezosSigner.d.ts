import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { TempleWallet } from '@temple-wallet/dapp';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { BeaconWalletTezosSigner } from './beaconWalletTezosSigner';
import { TempleWalletTezosSigner } from './templeWalletTezosSigner';
export declare class WalletTezosSigner implements Signer {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly wallet: TempleWallet | BeaconWallet;
    readonly blockchain = "tezos";
    protected readonly internalSigner: Signer;
    constructor(atomexNetwork: AtomexNetwork, wallet: TempleWallet | BeaconWallet);
    getAddress(): Promise<string> | string;
    getPublicKey(): Promise<string | undefined> | string | undefined;
    sign(message: string): Promise<AtomexSignature>;
    protected createInternalSigner(): BeaconWalletTezosSigner | TempleWalletTezosSigner;
}
