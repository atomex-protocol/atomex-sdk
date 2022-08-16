import type { BigNumber } from 'bignumber.js';
import type { Side } from '../../common/index';
import type { SwapParticipantRequisites } from '../../swaps/index';
import type { OrderPreview } from './orderPreview';
import type { OrderType } from './orderType';
interface OrderBody {
    type: OrderType;
    price: BigNumber;
    amount: BigNumber;
    symbol: string;
    side: Side;
}
export interface NewOrderRequest {
    orderBody: OrderPreview | OrderBody;
    clientOrderId?: string;
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
export declare type Algorithm = 'Ed25519' | 'Ed25519:Blake2b' | 'Sha256WithEcdsa:Secp256k1' | 'Blake2bWithEcdsa:Secp256k1' | 'Blake2bWithEcdsa:Secp256r1' | 'Keccak256WithEcdsa:Geth2940' | 'Sha256WithEcdsa:BtcMsg';
export {};
