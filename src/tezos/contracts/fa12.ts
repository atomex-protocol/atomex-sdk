import type { ContractProvider, Wallet, ContractAbstraction, ContractMethod } from '@taquito/taquito';
import type BigNumber from 'bignumber.js';

export type FA12Contract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    approve(address: string, amount: BigNumber): ContractMethod<T>;
  }
};
