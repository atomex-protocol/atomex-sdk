import type { AbiItem } from 'web3-utils';

import type { Web3AtomexProtocolV1Options } from '../../evm/index';

export interface EthereumAtomexProtocolV1Options extends Web3AtomexProtocolV1Options {
  abi: AbiItem[];
}

export type ERC20EthereumAtomexProtocolV1Options = EthereumAtomexProtocolV1Options;
