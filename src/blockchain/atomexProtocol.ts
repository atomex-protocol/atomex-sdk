import type { AtomexNetwork } from '../common/index';

export interface AtomexProtocol {
  readonly type: string;
  readonly atomexNetwork: AtomexNetwork;
}
