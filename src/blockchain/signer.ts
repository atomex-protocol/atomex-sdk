import type { AtomexNetwork } from '../common/index';
import type { AtomexSignature } from './models/index';

export interface Signer {
  readonly atomexNetwork: AtomexNetwork;
  readonly blockchain: string;

  getAddress(): Promise<string> | string;
  getPublicKey(): Promise<string> | string;

  sign(message: string): Promise<AtomexSignature>;
}
