import type { TempleWallet } from '@temple-wallet/dapp';

import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { TezosAtomexSigningMessageType } from '../models/index';
import { decodePublicKey, signingUtils } from '../utils/index';
import { decodeSignature } from '../utils/signing';

export class TempleWalletTezosSigner implements Signer {
  readonly blockchain = 'tezos';

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
      this.templeWallet.sign(signingUtils.getWalletMichelineSigningData(message))
    ]);

    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      signingMessageType: TezosAtomexSigningMessageType.WalletMicheline
    };
  }
}
