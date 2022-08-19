import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { Unit } from 'web3-utils';

export const getGasPriceInWei = async (toolkit: Web3): Promise<BigNumber> => {
  const gasPrice = await toolkit.eth.getGasPrice();

  return new BigNumber(gasPrice);
};

export const convertFromWei = (toolkit: Web3, value: BigNumber | string, unit: Unit): BigNumber => {
  const stringValue = typeof value === 'string' ? value : value.toString(10);
  const result = toolkit.utils.fromWei(stringValue, unit);

  return new BigNumber(result);
};
