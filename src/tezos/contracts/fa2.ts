import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';

export interface FA2UpdateOperatorParams {
  owner: string;
  operator: string;
  token_id: number;
}

export interface FA2AddOperatorParams {
  add_operator: FA2UpdateOperatorParams;
}

export interface FA2RemoveOperatorParams {
  remove_operator: FA2UpdateOperatorParams;
}

export type FA2UpdateOperatorsPayload = Array<FA2AddOperatorParams | FA2RemoveOperatorParams>;

export type FA2Contract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    update_operators(payload: FA2UpdateOperatorsPayload): ContractMethod<T>;
  }
};
