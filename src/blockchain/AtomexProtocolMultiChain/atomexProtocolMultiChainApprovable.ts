import type { Transaction } from '../models';
import type { AtomexProtocolMultiChainBase } from './base';
import type { AtomexProtocolMultiChainInitiateParameters } from './initiateParameters';

export interface AtomexProtocolMultiChainApprovable extends AtomexProtocolMultiChainBase {
  readonly type: 'MultiChainApprovable';

  approve(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
}
