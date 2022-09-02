import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { Unit } from 'web3-utils';

const defaultMaxPriorityFeePerGasInWei = new BigNumber(2_500_000_000);

export const getGasPriceInWei = async (toolkit: Web3): Promise<BigNumber> => {
  const gasPrice = await toolkit.eth.getGasPrice();

  return new BigNumber(gasPrice);
};

export const getMaxFeePerGas = async (toolkit: Web3, maxPriorityFeePerGasInWei = defaultMaxPriorityFeePerGasInWei): Promise<BigNumber> => {
  const latestBlock = await toolkit.eth.getBlock('latest');
  if (!latestBlock.baseFeePerGas)
    return getGasPriceInWei(toolkit);

  const latestBlockBaseFeePerGasInWei = new BigNumber(latestBlock.baseFeePerGas);
  return latestBlockBaseFeePerGasInWei
    .multipliedBy(2)
    .plus(maxPriorityFeePerGasInWei);
};

export const convertFromWei = (toolkit: Web3, value: BigNumber | string, unit: Unit): BigNumber => {
  const stringValue = typeof value === 'string' ? value : value.toString(10);
  const result = toolkit.utils.fromWei(stringValue, unit);

  return new BigNumber(result);
};
