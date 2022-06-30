import type { AtomexNetwork } from '../common';
import type { AtomexSignature } from './models';

export interface Signer {
  readonly atomexNetwork: AtomexNetwork;

  getAddress(): Promise<string>;
  getPublicKey(): Promise<string>;
  sign(message: string): Promise<AtomexSignature>;
}
