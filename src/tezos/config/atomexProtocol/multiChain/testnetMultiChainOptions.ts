import type {
  FA2TezosTaquitoAtomexProtocolMultiChainOptions,
  TezosTaquitoAtomexProtocolMultiChainOptions
} from '../../../models/index';
import { testnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase } from './base';

const testnetNativeTezosTaquitoAtomexProtocolMultiChainOptions: TezosTaquitoAtomexProtocolMultiChainOptions = {
  atomexProtocolVersion: 1,
  currencyId: 'XTZ',
  swapContractAddress: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
  swapContractBlockId: '320132',
  initiateOperation: {
    fee: 2000,
    gasLimit: 11000,
    storageLimit: 257
  },
  redeemOperation: {
    fee: 2000,
    gasLimit: 15000,
    storageLimit: 257
  },
  refundOperation: {
    fee: 1600,
    gasLimit: 13000,
    storageLimit: 257,
  }
};


const testnetUSDtTezosTaquitoAtomexProtocolMultiChainOptions: FA2TezosTaquitoAtomexProtocolMultiChainOptions = {
  ...testnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase,
  currencyId: 'USDT_XTZ',
  swapContractAddress: 'KT1HHjNxi3okxxGJT1SPPhpcs3gMQt8hqixY',
  swapContractBlockId: '734339'
};

export const testnetTezosTaquitoAtomexProtocolMultiChainOptions = {
  XTZ: testnetNativeTezosTaquitoAtomexProtocolMultiChainOptions,
  USDT_XTZ: testnetUSDtTezosTaquitoAtomexProtocolMultiChainOptions
} as const;
