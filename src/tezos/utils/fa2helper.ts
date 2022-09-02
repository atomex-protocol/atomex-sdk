import type { ContractMethod, ContractMethodObject, TezosToolkit, Wallet, WalletOperationBatch } from '@taquito/taquito';

import type { FA2Contract } from '../contracts';

export interface WrapTransactionsWithFA2ApproveOptions {
  toolkit: TezosToolkit;
  tokenContract: FA2Contract<Wallet>;
  ownerAddress: string;
  approvedAddress: string;
  tokenId: number;
  contractCalls: Array<ContractMethod<Wallet> | ContractMethodObject<Wallet>>;
}

export const wrapContractCallsWithApprove = (options: WrapTransactionsWithFA2ApproveOptions): WalletOperationBatch => {
  const batch = options.toolkit.wallet.batch()
    .withContractCall(options.tokenContract.methods.update_operators([{
      add_operator: {
        owner: options.ownerAddress,
        operator: options.approvedAddress,
        token_id: options.tokenId
      }
    }]));

  options.contractCalls.forEach(call => batch.withContractCall(call));

  batch
    .withContractCall(options.tokenContract.methods.update_operators([{
      remove_operator: {
        owner: options.ownerAddress,
        operator: options.approvedAddress,
        token_id: options.tokenId
      }
    }]));

  return batch;
};
