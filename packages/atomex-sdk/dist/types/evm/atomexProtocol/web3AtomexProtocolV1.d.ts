import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { AtomexBlockchainProvider, AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters, BlockchainWallet, FeesInfo, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { PriceManager } from '../../exchange';
import type { Web3AtomexProtocolV1Options } from '../models/index';
export declare abstract class Web3AtomexProtocolV1 implements AtomexProtocolV1 {
    protected readonly blockchain: string;
    readonly atomexNetwork: AtomexNetwork;
    protected readonly atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolV1Options>;
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider;
    protected readonly walletsManager: WalletsManager;
    protected readonly priceManager: PriceManager;
    protected static maxNetworkFeeMultiplier: BigNumber;
    readonly version = 1;
    constructor(blockchain: string, atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolV1Options>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    get currencyId(): string;
    get swapContractAddress(): string;
    abstract initiate(params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    abstract redeem(params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
    abstract getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    abstract refund(params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
    getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo>;
    protected getReadonlyWeb3(): Promise<Web3>;
    protected getWallet(address?: string): Promise<BlockchainWallet<Web3>>;
}
