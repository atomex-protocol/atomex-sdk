import type { Currency } from '../../common/index';

export interface NativeEthereumCurrency extends Currency {
  readonly name: 'Ethereum';
  readonly symbol: 'ETH';
  readonly blockchain: 'ethereum';
  readonly type: 'native';
  readonly decimals: 18;
}

export interface ERC20EthereumCurrency extends Currency {
  readonly blockchain: 'ethereum';
  readonly type: 'erc-20';
  readonly contractAddress: string;
}

export type EthereumCurrency =
  | NativeEthereumCurrency
  | ERC20EthereumCurrency;
