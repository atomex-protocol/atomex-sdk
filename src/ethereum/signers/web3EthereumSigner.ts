import type Web3 from 'web3';

import type { AtomexContext } from '../../atomex/atomexContext';
import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, Signer } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { recoverPublicKey } from '../utils/index';

export class Web3EthereumSigner implements Signer {
  static readonly signingAlgorithm = 'Keccak256WithEcdsa:Geth2940';

  readonly blockchain = 'ethereum';

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly atomexContext: AtomexContext,
    readonly provider: Web3['currentProvider']
  ) { }

  static bind(atomex: Atomex, provider: Web3['currentProvider']): void {
    const signer = new Web3EthereumSigner(atomex.atomexNetwork, atomex.atomexContext, provider);
    atomex.addSigner(signer);
  }

  async getAddress(): Promise<string> {
    const web3 = await this.atomexContext.providers.blockchainProvider.getReadonlyToolkit(this.blockchain, 'web3') as Web3;
    const accounts = await web3.eth.getAccounts();
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
    const web3 = await this.atomexContext.providers.blockchainProvider.getToolkit(this.blockchain, address, 'web3') as Web3;
    const signatureBytes = await this.signInternal(message, address, web3);
    const publicKeyBytes = recoverPublicKey(signatureBytes, web3.eth.accounts.hashMessage(message));

    return {
      address,
      publicKeyBytes: publicKeyBytes.startsWith('0x') ? publicKeyBytes.substring(2) : publicKeyBytes,
      signatureBytes: signatureBytes.substring(signatureBytes.startsWith('0x') ? 2 : 0, signatureBytes.length - 2),
      algorithm: Web3EthereumSigner.signingAlgorithm
    };
  }

  protected signInternal(message: string, address: string, web3: Web3) {
    return new Promise<string>((resolve, reject) => web3.eth.personal.sign(message, address, '', (error, signature) => {
      return signature ? resolve(signature) : reject(error);
    }));
  }
}
