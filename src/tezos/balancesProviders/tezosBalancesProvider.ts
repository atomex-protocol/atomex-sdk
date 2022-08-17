import type BigNumber from 'bignumber.js';

import type { BalancesProvider } from '../../blockchain/index';
import type { Currency } from '../../index';
import { isTezosCurrency } from '../utils';

export class TezosBalancesProvider implements BalancesProvider {
  constructor(
    private readonly baseUrl: string
  ) { }

  getBalance(_address: string, currency: Currency): Promise<BigNumber> {
    if (!isTezosCurrency(currency))
      throw new Error('Not tezos blockchain currency provided');

    throw new Error('Not implemented');
  }
}
