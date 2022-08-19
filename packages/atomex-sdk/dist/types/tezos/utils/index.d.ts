import BigNumber from 'bignumber.js';
export { isTezosCurrency } from './guards';
export declare const mutezInTez: BigNumber;
export declare const decodePublicKey: (publicKey: string) => string;
export * as signingUtils from './signing';
