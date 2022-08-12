import type { AbiItem } from 'web3-utils';

import type { Web3AtomexProtocolV1Options } from '../../evm/index';

export interface EthereumWeb3AtomexProtocolV1Options extends Web3AtomexProtocolV1Options {
  abi: AbiItem[];
}

export type ERC20EthereumWeb3AtomexProtocolV1Options = EthereumWeb3AtomexProtocolV1Options;
