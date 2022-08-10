
import type { BlockTransactionString } from 'web3-eth';

export interface EthereumBlockRequiredInfo {
  number: BlockTransactionString['number'],
  timestamp: BlockTransactionString['timestamp']
}

export interface TezosBlockRequiredInfo {
  level: number,
  timestamp: number
}

export const latestEthereumBlockRequiredInfo: EthereumBlockRequiredInfo = {
  number: 7376689,
  timestamp: 1660089989
};

export const latestTezosBlockRequiredInfo: TezosBlockRequiredInfo = {
  level: 989797,
  timestamp: 1660090915
};
