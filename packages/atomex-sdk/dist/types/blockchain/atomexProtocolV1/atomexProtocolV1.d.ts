import type { Currency } from '../../common/index';
import type { AtomexProtocol } from '../atomexProtocol';
import type { FeesInfo, Transaction } from '../models/index';
import type { AtomexProtocolV1InitiateParameters } from './initiateParameters';
import type { AtomexProtocolV1RedeemParameters } from './redeemParameters';
import type { AtomexProtocolV1RefundParameters } from './refundParameters';
export interface AtomexProtocolV1 extends AtomexProtocol {
    readonly version: 1;
    readonly currencyId: Currency['id'];
    readonly swapContractAddress: string;
    initiate(params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    redeem(params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    getRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    refund(params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    getRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
}
