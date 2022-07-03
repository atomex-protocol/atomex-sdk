import { Prefix } from '@taquito/utils';

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
