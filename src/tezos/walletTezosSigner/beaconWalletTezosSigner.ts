import { SigningType } from '@airgap/beacon-sdk';
import type { BeaconWallet } from '@taquito/beacon-wallet';

import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { TezosAtomexSigningDataType } from '../models/index';
import { decodePublicKey, signingUtils } from '../utils/index';
import { decodeSignature } from '../utils/signing';

export class BeaconWalletTezosSigner implements Signer {
  readonly blockchain = 'tezos';

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly beaconWallet: BeaconWallet
  ) {
  }

  getAddress(): Promise<string> {
    return this.beaconWallet.getPKH();
  }

  async getPublicKey(): Promise<string | undefined> {
    return (await this.beaconWallet.client.getActiveAccount())?.publicKey;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.beaconWallet.client.requestSignPayload({
        payload: signingUtils.getWalletMichelineSigningData(message),
        signingType: SigningType.MICHELINE,
      })
    ]);

    if (!publicKey)
      throw new Error('BeaconWallet: public key is unavailable');

    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature.signature);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      signingDataType: TezosAtomexSigningDataType.WalletMicheline
    };
  }
}
