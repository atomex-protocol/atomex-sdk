import type { AbiItem } from 'web3-utils';

import { type Atomex, legacy } from '../../src/index';
import config from '../../src/legacy/config';
import type { TezosBasedCurrency } from '../../src/legacy/types';

export const createEthereumHelpers = (
  newAtomex: Atomex,
  network: 'mainnet' | 'testnet',
  web3Mock: jest.Mock
): Promise<legacy.EthereumHelpers> => Promise.resolve(new legacy.EthereumHelpers(
  newAtomex,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  web3Mock as any,
  config.currencies.ETH.contracts.abi as AbiItem[],
  config.currencies.ETH.contracts[network].address,
  config.blockchains.ethereum.rpc[network].blockTime,
  config.currencies.ETH.contracts[network].gasLimit
));

export const createTezoselpers = (
  newAtomex: Atomex,
  network: 'mainnet' | 'testnet',
  tezosToolkit: jest.Mock,
  currency: TezosBasedCurrency = 'XTZ',
): Promise<legacy.TezosHelpers> => Promise.resolve(new legacy.TezosHelpers(
  newAtomex,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tezosToolkit as any,
  config.currencies[currency].contracts.entrypoints,
  config.currencies[currency].contracts[network].address,
  config.blockchains.tezos.rpc[network].blockTime,
  config.currencies[currency].contracts[network].gasLimit,
  config.blockchains.tezos.rpc[network].minimalFees,
  config.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit,
  config.blockchains.tezos.rpc[network].minimalNanotezPerByte,
  config.blockchains.tezos.rpc[network].costPerByte,
  config.currencies[currency].contracts[network].redeemTxSize,
  config.currencies[currency].contracts[network].initiateTxSize,
));
