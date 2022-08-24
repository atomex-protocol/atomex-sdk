import type BigNumber from 'bignumber.js';

import type { Currency, DataSource, Disposable } from '../../common/index';

export interface GetPriceParameters {
  baseCurrency: Currency['id'];
  quoteCurrency: Currency['id'];
  provider?: string;
  dataSource?: DataSource;
}

export interface GetAveragePriceParameters {
  baseCurrency: Currency['id'];
  quoteCurrency: Currency['id'];
  dataSource?: DataSource;
}

export interface PriceManager extends Disposable {
  getPrice(parameters: GetPriceParameters): Promise<BigNumber | undefined>;
  getAveragePrice(parameters: GetAveragePriceParameters): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
