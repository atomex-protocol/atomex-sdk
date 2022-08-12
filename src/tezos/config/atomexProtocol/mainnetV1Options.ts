import type { FA12TezosTaquitoAtomexProtocolV1Options, FA2TezosTaquitoAtomexProtocolV1Options, TezosTaquitoAtomexProtocolV1Options } from '../../models/index';
import { mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase, mainnetFA2TezosTaquitoAtomexProtocolV1OptionsBase } from './base';

const mainnetNativeTezosTaquitoAtomexProtocolV1Options: TezosTaquitoAtomexProtocolV1Options = {
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

const mainnetTZBTCTezosTaquitoAtomexProtocolV1Options: FA12TezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: 'TZBTC',
  swapContractAddress: 'KT1Ap287P1NzsnToSJdA4aqSNjPomRaHBZSr',
  swapContractBlockId: '900350',
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase.redeemOperation,
    gasLimit: 180000
  }
};

const mainnetKUSDTezosTaquitoAtomexProtocolV1Options: FA12TezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: 'KUSD',
  swapContractAddress: 'KT1EpQVwqLGSH7vMCWKJnq6Uxi851sEDbhWL',
  swapContractBlockId: '1358868',
  redeemOperation: {
    ...mainnetFA12TezosTaquitoAtomexProtocolV1OptionsBase.redeemOperation,
    gasLimit: 110000
  }
};


const mainnetUSDtTezosTaquitoAtomexProtocolV1Options: FA2TezosTaquitoAtomexProtocolV1Options = {
  ...mainnetFA2TezosTaquitoAtomexProtocolV1OptionsBase,
  currencyId: 'USDT_XTZ',
  swapContractAddress: 'KT1Ays1Chwx3ArnHGoQXchUgDsvKe9JboUjj',
  swapContractBlockId: '2496680'
};

export const mainnetTezosTaquitoAtomexProtocolV1Options = {
  XTZ: mainnetNativeTezosTaquitoAtomexProtocolV1Options,
  TZBTC: mainnetTZBTCTezosTaquitoAtomexProtocolV1Options,
  KUSD: mainnetKUSDTezosTaquitoAtomexProtocolV1Options,
  USDT_XTZ: mainnetUSDtTezosTaquitoAtomexProtocolV1Options
} as const;
