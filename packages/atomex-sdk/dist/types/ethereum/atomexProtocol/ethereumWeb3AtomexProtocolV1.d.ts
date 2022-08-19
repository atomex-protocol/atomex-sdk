import type BigNumber from 'bignumber.js';
import type { AtomexBlockchainProvider, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters, FeesInfo, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { Web3AtomexProtocolV1 } from '../../evm/index';
import type { EthereumWeb3AtomexProtocolV1Options } from '../models/index';
export declare class EthereumWeb3AtomexProtocolV1 extends Web3AtomexProtocolV1 {
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolV1Options>;
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolV1Options>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager);
    initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    getInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber>;
    getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
}
