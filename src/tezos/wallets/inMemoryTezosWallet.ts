import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { decodePublicKey, signingUtils } from '../utils/index';

export class InMemoryTezosWallet implements BlockchainWallet<TezosToolkit> {
  readonly id = 'taquito';
  readonly toolkit: TezosToolkit;

  protected readonly internalInMemorySigner: InMemorySigner;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    secretKey: string,
    rpcUrl: string,
  ) {
    this.internalInMemorySigner = new InMemorySigner(secretKey);
    this.toolkit = new TezosToolkit(rpcUrl);
    this.toolkit.setSignerProvider(this.internalInMemorySigner);
  }

  getBlockchain(): string | Promise<string> {
    return 'tezos';
  }

  getAddress(): Promise<string> {
    return this.internalInMemorySigner.publicKeyHash();
  }

  getPublicKey(): Promise<string> {
    return this.internalInMemorySigner.publicKey();
  }

  async sign(message: string): Promise<AtomexSignature> {
    const messageBytes = signingUtils.getRawSigningData(message);

    const [address, publicKey, rawSignature] = await Promise.all([
      this.getAddress(),
      this.getPublicKey(),
      this.internalInMemorySigner.sign(messageBytes)
    ]);

    const publicKeyBytes = decodePublicKey(publicKey);
    const signatureBytes = rawSignature.sbytes.substring(rawSignature.bytes.length);
    const algorithm = signingUtils.getTezosSigningAlgorithm(publicKey);

    return {
      address,
      algorithm,
      publicKeyBytes,
      signatureBytes
    };
  }
}
