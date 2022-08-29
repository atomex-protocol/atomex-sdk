import type BigNumber from 'bignumber.js';

import type { Currency, DataSource, Disposable } from '../../common/index';

export interface GetPriceParameters {
  baseCurrency: Currency | Currency['id'] | string;
  quoteCurrency: Currency | Currency['id'] | string;
  provider?: string;
  dataSource?: DataSource;
}

export interface GetAveragePriceParameters {
  baseCurrency: Currency | Currency['id'] | string;
  quoteCurrency: Currency | Currency['id'] | string;
  dataSource?: DataSource;
}

export interface PriceManager extends Disposable {
  getPrice(parameters: GetPriceParameters): Promise<BigNumber | undefined>;
  getAveragePrice(parameters: GetAveragePriceParameters): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
