import { b58cdecode, prefix, validatePkAndExtractPrefix } from '@taquito/utils';

import { Buffer } from '../../native';
export { isTezosCurrency } from './guards';

export const decodePublicKey = (publicKey: string) => {
  const keyPrefix = validatePkAndExtractPrefix(publicKey);
  const decodedKeyBytes = b58cdecode(publicKey, prefix[keyPrefix]);

  return Buffer.from(decodedKeyBytes).toString('hex');
};
export * as signingUtils from './signing';
