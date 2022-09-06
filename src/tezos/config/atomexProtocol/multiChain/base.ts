
import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions, FA2TezosTaquitoAtomexProtocolMultiChainOptions } from '../../../models/index';

export const mainnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase: Omit<
  FA12TezosTaquitoAtomexProtocolMultiChainOptions,
  'currencyId' | 'swapContractAddress' | 'swapContractBlockId'
> = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 11000,
    gasLimit: 110000,
    storageLimit: 350,
  },
  redeemOperation: {
    fee: 11000,
    gasLimit: 15000,
    storageLimit: 257
  },
  refundOperation: {
    fee: 11000,
    gasLimit: 110000,
    storageLimit: 257,
  }
};

export const mainnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase: Omit<
  FA2TezosTaquitoAtomexProtocolMultiChainOptions,
  'currencyId' | 'swapContractAddress' | 'swapContractBlockId'
> = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 350000,
    gasLimit: 400000,
    storageLimit: 250,
  },
  redeemOperation: {
    fee: 120000,
    gasLimit: 400000,
    storageLimit: 257
  },
  refundOperation: {
    fee: 120000,
    gasLimit: 400000,
    storageLimit: 257,
  }
};

export const testnetFA12TezosTaquitoAtomexProtocolMultiChainOptionsBase: Omit<
  FA12TezosTaquitoAtomexProtocolMultiChainOptions,
  'currencyId' | 'swapContractAddress' | 'swapContractBlockId'
> = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 2000,
    gasLimit: 15000,
    storageLimit: 350,
  },
  redeemOperation: {
    fee: 2500,
    gasLimit: 20000,
    storageLimit: 257
  },
  refundOperation: {
    fee: 2500,
    gasLimit: 15000,
    storageLimit: 257,
  }
};

export const testnetFA2TezosTaquitoAtomexProtocolMultiChainOptionsBase: Omit<
  FA2TezosTaquitoAtomexProtocolMultiChainOptions,
  'currencyId' | 'swapContractAddress' | 'swapContractBlockId'
> = {
  atomexProtocolVersion: 1,
  initiateOperation: {
    fee: 350000,
    gasLimit: 400000,
    storageLimit: 250,
  },
  redeemOperation: {
    fee: 120000,
    gasLimit: 400000,
    storageLimit: 257
  },
  refundOperation: {
    fee: 120000,
    gasLimit: 400000,
    storageLimit: 257,
  }
};
