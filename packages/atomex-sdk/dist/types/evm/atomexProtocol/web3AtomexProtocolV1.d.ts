import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { AtomexBlockchainProvider, AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters, BlockchainWallet, FeesInfo, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { Web3AtomexProtocolV1Options } from '../models/index';
export declare abstract class Web3AtomexProtocolV1 implements AtomexProtocolV1 {
    protected readonly blockchain: string;
    readonly atomexNetwork: AtomexNetwork;
    protected readonly atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolV1Options>;
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider;
    protected readonly walletsManager: WalletsManager;
    protected static maxNetworkFeeMultiplier: BigNumber;
    readonly version = 1;
    constructor(blockchain: string, atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolV1Options>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager);
    get currencyId(): string;
    get swapContractAddress(): string;
    abstract initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    abstract redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    abstract getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<FeesInfo>;
    getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    abstract refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    protected getReadonlyWeb3(): Promise<Web3>;
    protected getWallet(address?: string): Promise<BlockchainWallet<Web3>>;
}
