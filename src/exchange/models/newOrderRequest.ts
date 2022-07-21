import type { BigNumber } from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import type { SwapParticipantRequisites } from '../../swaps/index';
import type { OrderType } from './orderType';

export interface NewOrderRequest {
  clientOrderId: string;
  from: Currency['id'];
  to: Currency['id'];
  side: Side;
  price: BigNumber;
  amount: BigNumber;
  type: OrderType;
  //TODO: ???
  proofsOfFunds?: ProofOfFunds[];
  requisites?: SwapParticipantRequisites;
}

export interface ProofOfFunds {
  address: string;
  currency: string;
  timeStamp: number;
  message: string;
  publicKey: string;
  signature: string;
  algorithm: Algorithm;
}

export type Algorithm =
  | 'Ed25519'
  | 'Ed25519:Blake2b'
  | 'Sha256WithEcdsa:Secp256k1'
  | 'Blake2bWithEcdsa:Secp256k1'
  | 'Blake2bWithEcdsa:Secp256r1'
  | 'Keccak256WithEcdsa:Geth2940'
  | 'Sha256WithEcdsa:BtcMsg';
