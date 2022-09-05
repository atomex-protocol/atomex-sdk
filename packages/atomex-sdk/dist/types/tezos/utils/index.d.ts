import BigNumber from 'bignumber.js';
export { isTezosCurrency, isFA12TezosCurrency } from './guards';
export declare const mutezInTez: BigNumber;
export declare const decodePublicKey: (publicKey: string) => string;
export * as signingUtils from './signing';
export * as fa12helper from './fa12helper';
export * as fa2helper from './fa2helper';
