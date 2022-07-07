import type Web3 from 'web3';

import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { recoverPublicKey } from '../utils/index';

export class Web3EthereumSigner implements Signer {
  static readonly signingAlgorithm = 'Keccak256WithEcdsa:Geth2940';

  readonly blockchain = 'ethereum';

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly web3: Web3
  ) {
  }

  async getAddress(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    const address = accounts[0];
    if (!address)
      throw new Error('Address is unavailable');

    return address;
  }

  getPublicKey() {
    return undefined;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const address = await this.getAddress();
    const signatureBytes = await this.signInternal(message, address);
    const publicKeyBytes = recoverPublicKey(signatureBytes, this.web3.eth.accounts.hashMessage(message));

    return {
      address,
      publicKeyBytes: publicKeyBytes.startsWith('0x') ? publicKeyBytes.substring(2) : publicKeyBytes,
      signatureBytes: signatureBytes.substring(signatureBytes.startsWith('0x') ? 2 : 0, signatureBytes.length - 2),
      algorithm: Web3EthereumSigner.signingAlgorithm
    };
  }

  protected signInternal(message: string, address: string) {
    return new Promise<string>((resolve, reject) => this.web3.eth.personal.sign(message, address, '', (error, signature) => {
      return signature ? resolve(signature) : reject(error);
    }));
  }
}
