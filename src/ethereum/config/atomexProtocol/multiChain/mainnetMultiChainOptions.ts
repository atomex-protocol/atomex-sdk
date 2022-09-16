import type { EthereumWeb3AtomexProtocolMultiChainOptions } from '../../../models/index';
import { ethereumWeb3AtomexProtocolMultiChainABI } from './base';

const mainnetNativeEthereumWeb3AtomexProtocolMultiChainOptions: EthereumWeb3AtomexProtocolMultiChainOptions = {
  atomexProtocolVersion: 1,
  currencyId: 'ETH',
  swapContractAddress: '0x2b33e8490a4e87e4ab313ab6785d06fc54cf2e98',
  swapContractBlockId: '15545907',
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
