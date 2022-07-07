import BigNumber from 'bignumber.js';
export declare const hexStringToUint8Array: (hex: string) => Uint8Array;
export declare const uint8ArrayToHexString: (value: Uint8Array) => string;
export declare const stringToHexString: (value: string) => string;
export declare const hexStringToString: (value: string) => string;
export declare const objectToHexString: (value: Record<string, unknown>) => string;
export declare const hexStringToObject: <T extends Record<string, unknown> = Record<string, unknown>>(value: string) => T | null;
export declare const tokensAmountToNat: (tokensAmount: BigNumber | number, decimals: number) => BigNumber;
export declare const numberToTokensAmount: (value: BigNumber | number, decimals: number) => BigNumber;
