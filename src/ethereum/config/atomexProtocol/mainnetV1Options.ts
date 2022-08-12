import type { EthereumWeb3AtomexProtocolV1Options } from '../../models/index';
import { ethereumWeb3AtomexProtocolV1ABI } from './base';

const mainnetNativeEthereumWeb3AtomexProtocolV1Options: EthereumWeb3AtomexProtocolV1Options = {
  atomexProtocolVersion: 1,
  currencyId: 'ETH',
  swapContractAddress: '0xe9c251cbb4881f9e056e40135e7d3ea9a7d037df',
  swapContractBlockId: '8168569',
  initiateOperation: {
    gasLimit: {
      withoutReward: 200000,
      withReward: 210000
    }
  },
  redeemOperation: {
    gasLimit: 140000
  },
  refundOperation: {
    gasLimit: 90000
  },
  defaultGasPriceInGwei: 90,
  maxGasPriceInGwei: 650,
  abi: ethereumWeb3AtomexProtocolV1ABI
};

export const mainnetEthereumWeb3AtomexProtocolV1Options = {
  ETH: mainnetNativeEthereumWeb3AtomexProtocolV1Options
} as const;
