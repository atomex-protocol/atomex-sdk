import type { ContractMethod, ContractMethodObject, TezosToolkit, Wallet, WalletOperationBatch } from '@taquito/taquito';
import type BigNumber from 'bignumber.js';

import type { FA12Contract } from '../contracts';

export interface WrapTransactionsWithFA12ApproveParameters {
  toolkit: TezosToolkit;
  tokenContract: FA12Contract<Wallet>;
  approvedAddress: string;
  approvedAmount: BigNumber;
  contractCalls: Array<ContractMethod<Wallet> | ContractMethodObject<Wallet>>;
}

export const wrapContractCallsWithApprove = (options: WrapTransactionsWithFA12ApproveParameters): WalletOperationBatch => {
  const batch = options.toolkit.wallet.batch()
    .withContractCall(options.tokenContract.methods.approve(options.approvedAddress, options.approvedAmount));

  options.contractCalls.forEach(call => batch.withContractCall(call));

  return batch;
};
