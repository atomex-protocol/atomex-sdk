import type { ContractMethod, ContractMethodObject, TezosToolkit, Wallet, WalletOperationBatch } from '@taquito/taquito';
import type { FA2Contract } from '../contracts';
export interface WrapTransactionsWithFA2ApproveParameters {
    toolkit: TezosToolkit;
    tokenContract: FA2Contract<Wallet>;
    ownerAddress: string;
    approvedAddress: string;
    tokenId: number;
    contractCalls: Array<ContractMethod<Wallet> | ContractMethodObject<Wallet>>;
}
export declare const wrapContractCallsWithApprove: (options: WrapTransactionsWithFA2ApproveParameters) => WalletOperationBatch;
