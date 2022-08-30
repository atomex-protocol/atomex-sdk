import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions, FA2TezosTaquitoAtomexProtocolMultiChainOptions, TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase, mainnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase } from './base';

const mainnetNativeTezosTaquitoAtomexProtocolMultiChainOptions: TezosTaquitoAtomexProtocolMultiChainOptions = {
  atomexProtocolVersion: 1,
  currencyId: 'XTZ',
  swapContractAddress: 'KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL',
  swapContractBlockId: '513046',
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

const mainnetTZBTCTezosTaquitoAtomexProtocolMultiChainOptions: FA12TezosTaquitoAtomexProtocolMultiChainOptions = {
  ...mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase,
  currencyId: 'TZBTC',
  swapContractAddress: 'KT1Ap287P1NzsnToSJdA4aqSNjPomRaHBZSr',
  swapContractBlockId: '900350',
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase.redeemOperation,
    gasLimit: 180000
  }
};

const mainnetKUSDTezosTaquitoAtomexProtocolMultiChainOptions: FA12TezosTaquitoAtomexProtocolMultiChainOptions = {
  ...mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase,
  currencyId: 'KUSD',
  swapContractAddress: 'KT1EpQVwqLGSH7vMCWKJnq6Uxi851sEDbhWL',
  swapContractBlockId: '1358868',
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase.redeemOperation,
    gasLimit: 110000
  }
};


const mainnetUSDtTezosTaquitoAtomexProtocolMultiChainOptions: FA2TezosTaquitoAtomexProtocolMultiChainOptions = {
  ...mainnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase,
  currencyId: 'USDT_XTZ',
  swapContractAddress: 'KT1Ays1Chwx3ArnHGoQXchUgDsvKe9JboUjj',
  swapContractBlockId: '2496680'
};

export const mainnetTezosTaquitoAtomexProtocolMultiChainOptions = {
  XTZ: mainnetNativeTezosTaquitoAtomexProtocolMultiChainOptions,
  TZBTC: mainnetTZBTCTezosTaquitoAtomexProtocolMultiChainOptions,
  KUSD: mainnetKUSDTezosTaquitoAtomexProtocolMultiChainOptions,
  USDT_XTZ: mainnetUSDtTezosTaquitoAtomexProtocolMultiChainOptions
} as const;
