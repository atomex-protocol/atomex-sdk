import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { TempleWallet } from '@temple-wallet/dapp';

import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { BeaconWalletTezosSigner } from './beaconWalletTezosSigner';
import { TempleWalletTezosSigner } from './templeWalletTezosSigner';

export class WalletTezosSigner implements Signer {
  readonly blockchain = 'tezos';

  protected readonly internalSigner: Signer;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly wallet: TempleWallet | BeaconWallet
  ) {
    this.internalSigner = this.createInternalSigner();
  }

  static bind(atomex: Atomex, wallet: TempleWallet | BeaconWallet): void {
    const signer = new WalletTezosSigner(atomex.atomexNetwork, wallet);
    atomex.addSigner(signer);
  }

  getAddress(): Promise<string> | string {
    return this.internalSigner.getAddress();
  }

  getPublicKey(): Promise<string | undefined> | string | undefined {
    return this.internalSigner.getPublicKey();
  }

  sign(message: string): Promise<AtomexSignature> {
    return this.internalSigner.sign(message);
  }

  protected createInternalSigner() {
    if ((this.wallet as BeaconWallet).client?.name !== undefined)
      return new BeaconWalletTezosSigner(this.atomexNetwork, (this.wallet as BeaconWallet));
    else if ((this.wallet as TempleWallet).permission !== undefined && (this.wallet as TempleWallet).connected !== undefined)
      return new TempleWalletTezosSigner(this.atomexNetwork, (this.wallet as TempleWallet));
    else
      throw new Error('Unknown Tezos wallet');
  }
}
