import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';

export type TezosMultiChainSmartContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methodsObject: {
    initiate(args: {
      settings: {
        hashed_secret: string;
        refund_time: string;
        payoff: number;
      },
      participant: string;
    }): ContractMethod<T>;

    redeem(secret: string): ContractMethod<T>;
    refund(secret: string): ContractMethod<T>;
  }
};
