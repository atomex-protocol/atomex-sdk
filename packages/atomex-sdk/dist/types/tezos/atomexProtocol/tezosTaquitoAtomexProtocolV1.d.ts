import type BigNumber from 'bignumber.js';
import type { AtomexBlockchainProvider, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters, FeesInfo, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { TezosTaquitoAtomexProtocolV1Options } from '../models/index';
import { TaquitoAtomexProtocolV1 } from './taquitoAtomexProtocolV1';
export declare class TezosTaquitoAtomexProtocolV1 extends TaquitoAtomexProtocolV1 {
    protected readonly atomexProtocolOptions: DeepReadonly<TezosTaquitoAtomexProtocolV1Options>;
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<TezosTaquitoAtomexProtocolV1Options>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager);
    get currencyId(): string;
    initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber>;
    getRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    getRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
}
