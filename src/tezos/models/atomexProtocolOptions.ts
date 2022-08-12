import type { AtomexProtocolV1Options } from '../../blockchain/index';

export interface TaquitoAtomexProtocolV1Options extends AtomexProtocolV1Options {
  initiateOperation: {
    fee: number;
    gasLimit: number;
    storageLimit: number;
  };
  redeemOperation: {
    fee: number;
    gasLimit: number;
    storageLimit: number;
  };
  refundOperation: {
    fee: number;
    gasLimit: number;
    storageLimit: number;
  };
}

export type TezosTaquitoAtomexProtocolV1Options = TaquitoAtomexProtocolV1Options;

export type FA12TezosTaquitoAtomexProtocolV1Options = TezosTaquitoAtomexProtocolV1Options;
export type FA2TezosTaquitoAtomexProtocolV1Options = TezosTaquitoAtomexProtocolV1Options;
