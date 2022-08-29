import type BigNumber from 'bignumber.js';

import type { Currency, DataSource, Disposable } from '../../common/index';

export interface GetPriceParameters {
  baseCurrencyOrIdOrSymbol: Currency | Currency['id'];
  quoteCurrencyOrIdOrSymbol: Currency | Currency['id'];
  provider?: string;
  dataSource?: DataSource;
}

export interface GetAveragePriceParameters {
  baseCurrencyOrIdOrSymbol: Currency | Currency['id'];
  quoteCurrencyOrIdOrSymbol: Currency | Currency['id'];
  dataSource?: DataSource;
}

export interface PriceManager extends Disposable {
  getPrice(parameters: GetPriceParameters): Promise<BigNumber | undefined>;
  getAveragePrice(parameters: GetAveragePriceParameters): Promise<BigNumber | undefined>;
  getAvailableProviders(): string[];
}
