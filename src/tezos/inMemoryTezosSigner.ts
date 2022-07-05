import { InMemorySigner } from '@taquito/signer';

import type { AtomexSignature, Signer } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import { TezosAtomexSignatureTypes } from './models/index';
import { decodePublicKey, signingUtils } from './utils/index';

export class InMemoryTezosSigner implements Signer {
  protected readonly internalInMemorySigner: InMemorySigner;

  constructor(readonly atomexNetwork: AtomexNetwork, secretKey: string) {
    this.internalInMemorySigner = new InMemorySigner(secretKey);
  }

  getAddress(): Promise<string> | string {
    return this.internalInMemorySigner.publicKeyHash();
  }

  getPublicKey(): Promise<string> | string {
    return this.internalInMemorySigner.publicKey();
  }

  async sign(message: string): Promise<AtomexSignature> {
    const messageBytes = signingUtils.getRawMessage(message);

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
      signatureBytes,
      type: TezosAtomexSignatureTypes.Raw
    };
  }
}
