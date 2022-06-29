import BigNumber from 'bignumber.js';

export const tokensAmountToNat = (tokensAmount: BigNumber | number, decimals: number): BigNumber => {
  return new BigNumber(tokensAmount).multipliedBy(10 ** decimals).integerValue();
};

export const numberToTokensAmount = (value: BigNumber | number, decimals: number): BigNumber => {
  return new BigNumber(value).integerValue().div(10 ** decimals);
};
