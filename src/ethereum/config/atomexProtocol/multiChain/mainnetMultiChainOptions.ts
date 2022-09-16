import type { EthereumWeb3AtomexProtocolMultiChainOptions } from '../../../models/index';
import { ethereumWeb3AtomexProtocolMultiChainABI } from './base';

const mainnetNativeEthereumWeb3AtomexProtocolMultiChainOptions: EthereumWeb3AtomexProtocolMultiChainOptions = {
  atomexProtocolVersion: 1,
  currencyId: 'ETH',
  swapContractAddress: '0xCE2003F56D33f94CF817B2B860534dF6590D4068',
  swapContractBlockId: '15546351',
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
  abi: ethereumWeb3AtomexProtocolMultiChainABI
};

export const mainnetEthereumWeb3AtomexProtocolMultiChainOptions = {
  ETH: mainnetNativeEthereumWeb3AtomexProtocolMultiChainOptions
} as const;
