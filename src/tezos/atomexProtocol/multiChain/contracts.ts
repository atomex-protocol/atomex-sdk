import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';
import type BigNumber from 'bignumber.js';

export type TezosMultiChainSmartContractBase<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methodsObject: {
    redeem(secret: string): ContractMethod<T>;
    refund(secret: string): ContractMethod<T>;
  }
};

export type TezosMultiChainSmartContract<T extends ContractProvider | Wallet = ContractProvider> = TezosMultiChainSmartContractBase<T> & {
  methodsObject: {
    initiate(args: {
      settings: {
        hashed_secret: string;
        refund_time: string;
        payoff: BigNumber;
      };
      participant: string;
    }): ContractMethod<T>;
  }
};

export type FA12TezosMultiChainSmartContract<T extends ContractProvider | Wallet = ContractProvider> = TezosMultiChainSmartContractBase<T> & {
  methodsObject: {
    initiate(args: {
      tokenAddress: string;
      totalAmount: BigNumber;
      hashedSecret: string;
      participant: string;
      payoffAmount: BigNumber;
      refundTime: string;
    }): ContractMethod<T>;
  }
};

export type FA2TezosMultiChainSmartContract<T extends ContractProvider | Wallet = ContractProvider> = TezosMultiChainSmartContractBase<T> & {
  methodsObject: {
    initiate(args: {
      tokenAddress: string;
      tokenId: number;
      totalAmount: BigNumber;
      hashedSecret: string;
      participant: string;
      payoffAmount: BigNumber;
      refundTime: string;
    }): ContractMethod<T>;
  }
};
