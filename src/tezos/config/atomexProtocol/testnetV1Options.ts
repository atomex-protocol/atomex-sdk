import type { FA2TezosTaquitoAtomexProtocolV1Options, TezosTaquitoAtomexProtocolV1Options } from '../../models/index';
import { testnetFA2TezosTaquitoAtomexProtocolV1OptionsBase } from './base';

const testnetNativeTezosTaquitoAtomexProtocolV1Options: TezosTaquitoAtomexProtocolV1Options = {
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


const testnetUSDtTezosTaquitoAtomexProtocolV1Options: FA2TezosTaquitoAtomexProtocolV1Options = {
  ...testnetFA2TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: 'USDT_XTZ',
  swapContractAddress: 'KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR',
  swapContractBlockId: '665321'
};

export const testnetTezosTaquitoAtomexProtocolV1Options = {
  XTZ: testnetNativeTezosTaquitoAtomexProtocolV1Options,
  USDT_XTZ: testnetUSDtTezosTaquitoAtomexProtocolV1Options
} as const;
