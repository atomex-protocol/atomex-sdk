import type { Currency } from '../../common/index';

export interface TezosCurrency extends Currency {
  readonly name: 'Tezos';
  readonly symbol: 'XTZ';
  readonly blockchain: 'tezos';
  readonly type: 'native';
  readonly decimals: 6;
}

export interface TezosFA12Currency extends Currency {
  readonly blockchain: 'tezos';
  readonly type: 'fa1.2';
  readonly contractAddress: string;
}

export interface TezosFA2Currency extends Currency {
  readonly blockchain: 'tezos';
  readonly type: 'fa2';
  readonly contractAddress: string;
  readonly tokenId: number;
}
