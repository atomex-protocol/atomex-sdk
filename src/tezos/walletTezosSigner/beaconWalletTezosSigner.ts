import { SigningType } from '@airgap/beacon-sdk';
import type { BeaconWallet } from '@taquito/beacon-wallet';

import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { TezosAtomexSignatureTypes } from '../models/index';
import { decodePublicKey, signingUtils } from '../utils/index';
import { decodeSignature } from '../utils/signing';

export class BeaconWalletTezosSigner implements Signer {
  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly beaconWallet: BeaconWallet
  ) {
  }

  getAddress(): Promise<string> | string {
    return this.beaconWallet.getPKH();
  }

  async getPublicKey(): Promise<string> {
    const publicKey = (await this.beaconWallet.client.getActiveAccount())?.publicKey;
    if (!publicKey)
      throw new Error('BeaconWallet: public key is unavailable');

    return publicKey;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.beaconWallet.client.requestSignPayload({
        payload: signingUtils.getWalletMichelineMessage(message),
        signingType: SigningType.MICHELINE,
      })
    ]);
    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature.signature);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      type: TezosAtomexSignatureTypes.WalletMicheline
    };
  }
}
