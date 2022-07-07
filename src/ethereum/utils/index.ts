import { ec as EC } from 'elliptic';

import { Buffer } from '../../native';
import { converters } from '../../utils';
import { uint8ArrayToHexString } from '../../utils/converters';

let secp256k1Curve: EC | null = null;
const getSecp256k1Curve = () => {
  if (!secp256k1Curve)
    secp256k1Curve = new EC('secp256k1');

  return secp256k1Curve;
};

const splitSignature = (hexSignature: string): { r: string, s: string, v: number, recoveryParameter: number } => {
  const signatureBytes = converters.hexStringToUint8Array(hexSignature);

  if (signatureBytes.length !== 64 && signatureBytes.length !== 65)
    throw new Error(`Invalid signature: ${hexSignature}`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let v = signatureBytes.length === 64 ? 27 + (signatureBytes[32]! >> 7) : signatureBytes[64]!;
  if (v === 0 || v === 1)
    v += 27;

  const result = {
    r: uint8ArrayToHexString(signatureBytes.slice(0, 32)),
    s: uint8ArrayToHexString(signatureBytes.slice(32, 64)),
    v,
    recoveryParameter: 1 - (v % 2)
  };

  return result;
};

export const recoverPublicKey = (hexSignature: string, web3MessageHash: string) => {
  const splittedSignature = splitSignature(hexSignature);

  const messageBuffer = Buffer.from(web3MessageHash.startsWith('0x') ? web3MessageHash.substring(2) : web3MessageHash, 'hex');
  const ecPublicKey = getSecp256k1Curve().recoverPubKey(
    messageBuffer,
    { r: splittedSignature.r, s: splittedSignature.s },
    splittedSignature.recoveryParameter,
  );

  return '0x' + ecPublicKey.encode('hex', false);
};
