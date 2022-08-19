import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { Unit } from 'web3-utils';

export class Web3Helper {
  constructor(
    private readonly toolkit: Web3
  ) { }

  async getGasPriceInWei(): Promise<BigNumber> {
    const gasPrice = await this.toolkit.eth.getGasPrice();

    return new BigNumber(gasPrice);
  }

  convertFromWei(value: BigNumber | string, unit: Unit): BigNumber {
    const stringValue = typeof value === 'string' ? value : value.toString(10);
    const result = this.toolkit.utils.fromWei(stringValue, unit);

    return new BigNumber(result);
  }
}
