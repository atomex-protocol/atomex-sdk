import { b58cdecode, prefix, Prefix } from '@taquito/utils';

import { converters, textUtils } from '../../utils/index';
import type { SigPrefix } from '../models/index';

// 'Tezos Signed Message: '
const tezosSignedMessagePrefixBytes = '54657a6f73205369676e6564204d6573736167653a20';
const getMichelineSigningData = (message: string, prefixBytes?: string) => {
  const messageBytes = converters.stringToHexString(message);
  const signedMessageBytes = prefixBytes ? (prefixBytes + messageBytes) : messageBytes;
  const messageLength = textUtils.padStart((signedMessageBytes.length / 2).toString(16), 8, '0');

  return '0501' + messageLength + signedMessageBytes;
};

export const getRawSigningData = (message: string) => converters.stringToHexString(message);
export const getRawMichelineSigningData = (message: string) => getMichelineSigningData(message);
export const getWalletMichelineSigningData = (message: string) => getMichelineSigningData(message, tezosSignedMessagePrefixBytes);

export const getTezosSigningAlgorithm = (addressOrPublicKey: string) => {
  const prefix = addressOrPublicKey.substring(0, addressOrPublicKey.startsWith('tz') ? 3 : 4);

  switch (prefix) {
    case Prefix.TZ1:
    case Prefix.EDPK:
      return 'Ed25519:Blake2b';

    case Prefix.TZ2:
    case Prefix.SPPK:
      return 'Blake2bWithEcdsa:Secp256k1';

    case Prefix.TZ3:
    case Prefix.P2PK:
      return 'Blake2bWithEcdsa:Secp256r1';

    default:
      throw new Error(`Unexpected address/public key prefix: ${prefix} (${addressOrPublicKey})`);
  }
};

export const decodeSignature = (signature: string) => {
  const signaturePrefix = (signature.startsWith('sig')
    ? signature.substring(0, 3)
    : signature.substring(0, 5)) as SigPrefix;
  const decodedKeyBytes = b58cdecode(signature, prefix[signaturePrefix]);

  return Buffer.from(decodedKeyBytes).toString('hex');
};
