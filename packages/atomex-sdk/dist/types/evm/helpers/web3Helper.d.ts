import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { Unit } from 'web3-utils';
export declare const getGasPriceInWei: (toolkit: Web3) => Promise<BigNumber>;
export declare const getMaxFeePerGas: (toolkit: Web3, maxPriorityFeePerGasInWei?: BigNumber) => Promise<BigNumber>;
export declare const convertFromWei: (toolkit: Web3, value: BigNumber | string, unit: Unit) => BigNumber;
