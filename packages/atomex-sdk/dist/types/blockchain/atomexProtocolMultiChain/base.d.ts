import type { Currency } from '../../common/index';
import type { AtomexProtocol } from '../atomexProtocol';
import type { FeesInfo, Transaction } from '../models/index';
import type { AtomexProtocolMultiChainInitiateParameters } from './initiateParameters';
import type { AtomexProtocolMultiChainRedeemParameters } from './redeemParameters';
import type { AtomexProtocolMultiChainRefundParameters } from './refundParameters';
export interface AtomexProtocolMultiChainBase extends AtomexProtocol {
    readonly currencyId: Currency['id'];
    readonly swapContractAddress: string;
    initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;
    getRedeemFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;
    getRefundFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
}
