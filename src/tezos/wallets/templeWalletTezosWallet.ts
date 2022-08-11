import { TezosToolkit } from '@taquito/taquito';
import type { TempleWallet } from '@temple-wallet/dapp';

import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { TezosAtomexSigningDataType } from '../models/index';
import { decodePublicKey, signingUtils } from '../utils/index';
import { decodeSignature } from '../utils/signing';

export class TempleWalletTezosWallet implements BlockchainWallet<TezosToolkit> {
  readonly id = 'tezosToolkit';
  readonly blockchain = 'tezos';
  readonly toolkit: TezosToolkit;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly templeWallet: TempleWallet,
    rpcUrl: string
  ) {
    this.toolkit = new TezosToolkit(rpcUrl);
    this.toolkit.setWalletProvider(templeWallet);
  }

  getBlockchain(): string | Promise<string> {
    return 'tezos';
  }

  getAddress(): Promise<string> {
    return this.templeWallet.getPKH();
  }

  getPublicKey(): string | undefined {
    return this.templeWallet.permission?.publicKey;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const [address, publicKey, signature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.templeWallet.sign(signingUtils.getWalletMichelineSigningData(message))
    ]);

    if (!publicKey)
      throw new Error('TempleWallet: public key is unavailable');

    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);
    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = decodeSignature(signature);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes,
      signingDataType: TezosAtomexSigningDataType.WalletMicheline
    };
  }
}
