import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { Unit } from 'web3-utils';

export const getGasPrice = async (toolkit: Web3, unit: Unit): Promise<BigNumber> => {
  const gasPriceInWei = await toolkit.eth.getGasPrice();
  const gasPriceInTargetUnit = toolkit.utils.fromWei(gasPriceInWei, unit);

  return new BigNumber(gasPriceInTargetUnit);
};
