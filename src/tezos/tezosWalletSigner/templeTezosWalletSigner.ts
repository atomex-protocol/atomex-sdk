import type { TempleWallet } from '@temple-wallet/dapp';

import type { AtomexSignature, Signer } from '../../blockchain';
import type { AtomexNetwork } from '../../common';

export class TempleTezosWalletSigner implements Signer {
  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly templeWallet: TempleWallet
  ) {
  }

  getAddress(): Promise<string> | string {
    return this.templeWallet.getPKH();
  }

  getPublicKey(): Promise<string> | string {
    const publicKey = this.templeWallet.permission?.publicKey;
    if (!publicKey)
      throw new Error('TempleWallet: public key is unavailable');

    return publicKey;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const signature = await this.templeWallet.sign(message);
    const address = await this.getAddress();
    const publicKey = await this.getPublicKey();

    return {
      value: signature,
      publicKey,
      // TODO: detect the signing algorithm by the address
      algorithm: 'Ed25519:Blake2b'
    };
  }
}
