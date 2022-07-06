import type { AtomexNetwork } from '../common/index';
import { atomexUtils } from '../utils/index';
import type { Signer } from './signer';

export class SignersManager {
  private readonly _signers: Set<Signer> = new Set();

  constructor(readonly atomexNetwork: AtomexNetwork) {
  }

  protected get signers(): Set<Signer> {
    return this._signers;
  }

  addSigner(signer: Signer): Promise<Signer> {
    atomexUtils.ensureNetworksAreSame(this, signer);
    this._signers.add(signer);

    return Promise.resolve(signer);
  }

  async removeSigner(signer: Signer): Promise<boolean>;
  async removeSigner(address: string, blockchain?: string): Promise<boolean>;
  async removeSigner(signerOrAddress: Signer | string, blockchain?: string): Promise<boolean> {
    const signer = typeof signerOrAddress === 'string'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? (await this.findSigner(signerOrAddress, blockchain))
      : signerOrAddress;

    return signer ? this._signers.delete(signer) : false;
  }

  async findSigner(address: string, blockchain?: string): Promise<Signer | undefined> {
    if (!this.signers.size)
      return undefined;

    const signerAndAddressPromises: Array<Promise<[signer: Signer, address: string]>> = [];
    for (const signer of this.signers) {
      if (blockchain && signer.blockchain !== blockchain)
        continue;

      const addressOrPromise = signer.getAddress();
      if (typeof addressOrPromise === 'string') {
        if (addressOrPromise === address)
          return signer;
        else
          continue;
      }

      signerAndAddressPromises.push(addressOrPromise.then(address => [signer, address]));
    }

    const signerAndAddressResults = await Promise.allSettled(signerAndAddressPromises);
    for (const signerAndAddressResult of signerAndAddressResults) {
      if (signerAndAddressResult.status !== 'fulfilled') {
        // TODO: warning if status === 'rejected'
        continue;
      }

      if (signerAndAddressResult.value[1] === address)
        return signerAndAddressResult.value[0];
    }

    return undefined;
  }
}
