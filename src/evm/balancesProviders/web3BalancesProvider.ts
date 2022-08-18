import BigNumber from 'bignumber.js';
import type Web3 from 'web3';

import type { AtomexBlockchainProvider, BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../common/index';
import type { ERC20EthereumCurrency, NativeEthereumCurrency } from '../../ethereum/models';
import { isEthereumCurrency } from '../../ethereum/utils/index';
import { numberToTokensAmount } from '../../utils/converters';
import { erc20Abi } from '../abi/index';

export class Web3BalancesProvider implements BalancesProvider {
  constructor(
    private readonly blockchainProvider: AtomexBlockchainProvider
  ) { }

  async getBalance(address: string, currency: Currency): Promise<BigNumber> {
    if (!isEthereumCurrency(currency))
      throw new Error('Not ethereum blockchain currency provided');

    const toolkit = await this.blockchainProvider.getReadonlyToolkit<Web3>('web3');
    if (!toolkit)
      throw new Error('Readonly web3 toolkit not found');

    switch (currency.type) {
      case 'native':
        return await this.getNativeTokenBalance(address, currency, toolkit);

      case 'erc-20':
        return await this.getTokenBalance(address, currency, toolkit);
    }
  }

  private async getNativeTokenBalance(address: string, currency: NativeEthereumCurrency, toolkit: Web3): Promise<BigNumber> {
    const balance = await toolkit.eth.getBalance(address);

    return numberToTokensAmount(new BigNumber(balance), currency.decimals);
  }

  private async getTokenBalance(address: string, currency: ERC20EthereumCurrency, toolkit: Web3): Promise<BigNumber> {
    const contract = new toolkit.eth.Contract(erc20Abi, currency.contractAddress);
    const balance = await contract.methods.balanceOf(address).call() as string;

    return numberToTokensAmount(new BigNumber(balance), currency.decimals);
  }
}
