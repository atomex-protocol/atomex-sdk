import type { TempleWallet } from '@temple-wallet/dapp';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class TempleWalletTezosSigner implements Signer {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly templeWallet: TempleWallet;
    readonly blockchain = "tezos";
    constructor(atomexNetwork: AtomexNetwork, templeWallet: TempleWallet);
    getAddress(): Promise<string>;
    getPublicKey(): string | undefined;
    sign(message: string): Promise<AtomexSignature>;
}
