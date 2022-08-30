import type { AtomexProtocol } from '../atomexProtocol';
import type { AtomexProtocolMultiChain } from './atomexProtocolMultiChain';
import type { AtomexProtocolMultiChainApprovable } from './atomexProtocolMultiChainApprovable';
export declare const isAtomexProtocolMultiChain: (atomexProtocol: AtomexProtocol) => atomexProtocol is AtomexProtocolMultiChain;
export declare const isAtomexProtocolMultiChainApprovable: (atomexProtocol: AtomexProtocol) => atomexProtocol is AtomexProtocolMultiChainApprovable;