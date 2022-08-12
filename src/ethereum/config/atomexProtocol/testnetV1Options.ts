import type { EthereumWeb3AtomexProtocolV1Options } from '../../models/index';
import { mainnetEthereumWeb3AtomexProtocolV1Options } from './mainnetV1Options';

const testnetNativeEthereumWeb3AtomexProtocolV1Options: EthereumWeb3AtomexProtocolV1Options = {
  ...mainnetEthereumWeb3AtomexProtocolV1Options.ETH,
  swapContractAddress: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
  swapContractBlockId: '6954501',
};

export const testnetEthereumWeb3AtomexProtocolV1Options = {
  ETH: testnetNativeEthereumWeb3AtomexProtocolV1Options
} as const;
