import type { AbiItem } from 'web3-utils';
import type { Web3AtomexProtocolMultiChainOptions } from '../../evm/index';
export interface EthereumWeb3AtomexProtocolMultiChainOptions extends Web3AtomexProtocolMultiChainOptions {
    abi: AbiItem[];
}
export declare type ERC20EthereumWeb3AtomexProtocolMultiChainOptions = EthereumWeb3AtomexProtocolMultiChainOptions;
