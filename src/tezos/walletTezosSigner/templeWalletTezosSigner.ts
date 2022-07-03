import type { TempleWallet } from '@temple-wallet/dapp';

import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { converters } from '../../utils/index';
import { decodePublicKey, signingUtils } from '../utils/index';

export class TempleWalletTezosSigner implements Signer {
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
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.templeWallet.sign(message)
    ]);

    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = converters.stringToBytes(signature);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
    };
  }
}
