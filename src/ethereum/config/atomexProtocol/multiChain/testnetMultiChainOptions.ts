import type { EthereumWeb3AtomexProtocolMultiChainOptions } from '../../../models/index';
import { mainnetEthereumWeb3AtomexProtocolMultiChainOptions } from './mainnetMultiChainOptions';

const testnetNativeEthereumWeb3AtomexProtocolMultiChainOptions: EthereumWeb3AtomexProtocolMultiChainOptions = {
  ...mainnetEthereumWeb3AtomexProtocolMultiChainOptions.ETH,
  swapContractAddress: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
  swapContractBlockId: '6954501',
};

export const testnetEthereumWeb3AtomexProtocolMultiChainOptions = {
  ETH: testnetNativeEthereumWeb3AtomexProtocolMultiChainOptions
} as const;
