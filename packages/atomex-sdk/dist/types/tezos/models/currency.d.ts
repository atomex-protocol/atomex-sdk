import type { Currency } from '../../common/index';
export interface NativeTezosCurrency extends Currency {
    readonly name: 'Tezos';
    readonly symbol: 'XTZ';
    readonly blockchain: 'tezos';
    readonly type: 'native';
    readonly decimals: 6;
}
export interface FA12TezosCurrency extends Currency {
    readonly blockchain: 'tezos';
    readonly type: 'fa1.2';
    readonly contractAddress: string;
}
export interface FA2TezosCurrency extends Currency {
    readonly blockchain: 'tezos';
    readonly type: 'fa2';
    readonly contractAddress: string;
    readonly tokenId: number;
}
export declare type TezosCurrency = NativeTezosCurrency | FA12TezosCurrency | FA2TezosCurrency;
