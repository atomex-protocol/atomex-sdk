import BigNumber from 'bignumber.js';

import { Buffer } from '../native';

export const hexStringToUint8Array = (hex: string): Uint8Array => {
  const integers = hex.match(/[\da-f]{2}/gi)?.map(val => parseInt(val, 16));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Uint8Array(integers!);
};

export const uint8ArrayToHexString = (value: Uint8Array): string => Buffer.from(value).toString('hex');
export const stringToHexString = (value: string): string => Buffer.from(value, 'utf8').toString('hex');
export const hexStringToString = (value: string): string => Buffer.from(hexStringToUint8Array(value)).toString('utf8');

export const objectToHexString = (value: Record<string, unknown>): string => stringToHexString(JSON.stringify(value));
export const hexStringToObject = <T extends Record<string, unknown> = Record<string, unknown>>(value: string): T | null => {
  try {
    return JSON.parse(hexStringToString(value));
  }
  catch {
    return null;
  }
};

export const tokensAmountToNat = (tokensAmount: BigNumber | number, decimals: number): BigNumber => {
  return new BigNumber(tokensAmount).multipliedBy(10 ** decimals).integerValue();
};

export const numberToTokensAmount = (value: BigNumber | number, decimals: number): BigNumber => {
  return new BigNumber(value).integerValue().div(10 ** decimals);
};

export const toFixedBigNumber = (
  value: BigNumber.Value,
  decimalPlaces: number,
  roundingMode?: BigNumber.RoundingMode
): BigNumber => {
  value = BigNumber.isBigNumber(value) ? value : new BigNumber(value);

  return new BigNumber((value as BigNumber).toFixed(decimalPlaces, roundingMode));
};
