import type { AtomexProtocol } from '../atomexProtocol';
import type { AtomexProtocolV1 } from './atomexProtocolV1';

export const isAtomexProtocolV1 = (atomexProtocol: AtomexProtocol): atomexProtocol is AtomexProtocolV1 => {
  return atomexProtocol.version === 1;
};
