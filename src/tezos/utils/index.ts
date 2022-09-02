import { b58cdecode, prefix, validatePkAndExtractPrefix } from '@taquito/utils';
import BigNumber from 'bignumber.js';

import { Buffer } from '../../native';
export { isTezosCurrency, isFA12TezosCurrency } from './guards';

export const mutezInTez = new BigNumber(1_000_000);

export const decodePublicKey = (publicKey: string) => {
  const keyPrefix = validatePkAndExtractPrefix(publicKey);
  const decodedKeyBytes = b58cdecode(publicKey, prefix[keyPrefix]);

  return Buffer.from(decodedKeyBytes).toString('hex');
};
export * as signingUtils from './signing';
export * as fa12helper from './fa12helper';
export * as fa2helper from './fa2helper';
