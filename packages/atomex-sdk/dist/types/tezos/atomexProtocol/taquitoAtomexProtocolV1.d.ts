import type { TezosToolkit } from '@taquito/taquito';
import type BigNumber from 'bignumber.js';
import type { AtomexBlockchainProvider, AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters, BlockchainWallet, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { TaquitoAtomexProtocolV1Options } from '../models/index';
export declare abstract class TaquitoAtomexProtocolV1 implements AtomexProtocolV1 {
    protected readonly blockchain: string;
    readonly atomexNetwork: AtomexNetwork;
    protected readonly atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolV1Options>;
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider;
    protected readonly walletsManager: WalletsManager;
    readonly version = 1;
    constructor(blockchain: string, atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolV1Options>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager);
    get currencyId(): string;
    abstract initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    abstract getEstimatedInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;
    abstract redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    abstract getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber>;
    abstract getEstimatedRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;
    abstract refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    abstract getEstimatedRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;
    protected getReadonlyTezosToolkit(): Promise<TezosToolkit>;
    protected getWallet(address?: string): Promise<BlockchainWallet<TezosToolkit>>;
}
