import type BigNumber from 'bignumber.js';

import type { BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../common/index';
import { HttpClient } from '../../core/index';
import { numberToTokensAmount } from '../../utils/converters';
import type { FA12TezosCurrency, FA2TezosCurrency, NativeTezosCurrency } from '../models/index';
import { isTezosCurrency } from '../utils/index';

export class TzktBalancesProvider implements BalancesProvider {
  private readonly httpClient: HttpClient;

  constructor(baseUrl: string) {
    this.httpClient = new HttpClient(baseUrl);
  }

  async getBalance(address: string, currency: Currency): Promise<BigNumber> {
    if (!isTezosCurrency(currency))
      throw new Error('Not tezos blockchain currency provided');

    switch (currency.type) {
      case 'native':
        return await this.getNativeTokenBalance(address, currency);

      case 'fa1.2':
      case 'fa2':
        return await this.getTokenBalance(address, currency);
    }
  }

  private async getNativeTokenBalance(address: string, currency: NativeTezosCurrency): Promise<BigNumber> {
    const urlPath = `/v1/accounts/${address}/balance`;
    const balance = await this.httpClient.request<number>({ urlPath }, false);

    return numberToTokensAmount(balance, currency.decimals);
  }

  private async getTokenBalance(address: string, currency: FA12TezosCurrency | FA2TezosCurrency): Promise<BigNumber> {
    const urlPath = '/v1/tokens/balances';
    const params = {
      'account': address,
      'token.contract': currency.contractAddress,
      'token.tokenId': currency.type === 'fa1.2' ? 0 : currency.tokenId,
      'select': 'balance'
    };

    const balances = await this.httpClient.request<number[]>({ urlPath, params }, false);
    const balance = balances[0];
    if (balance === undefined)
      throw new Error('Invalid response');

    return numberToTokensAmount(balance, currency.decimals);
  }
}
