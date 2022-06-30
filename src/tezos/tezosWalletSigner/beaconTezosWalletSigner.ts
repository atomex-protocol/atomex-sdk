import { SigningType } from '@airgap/beacon-sdk';
import type { BeaconWallet } from '@taquito/beacon-wallet';

import type { AtomexSignature, Signer } from '../../blockchain';
import type { AtomexNetwork } from '../../common';

export class BeaconTezosWalletSigner implements Signer {
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
    const signatureResult = await this.beaconWallet.client.requestSignPayload({
      payload: message,
      signingType: SigningType.MICHELINE,
    });
    const address = await this.getAddress();
    const publicKey = await this.getPublicKey();

    return {
      value: signatureResult.signature,
      publicKey,
      // TODO: detect the signing algorithm by the address
      algorithm: 'Ed25519:Blake2b'
    };
  }
}
