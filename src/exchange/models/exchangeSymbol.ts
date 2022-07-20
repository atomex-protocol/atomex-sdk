import BigNumber from 'bignumber.js';

export interface ExchangeSymbol {
  readonly name: string;
  readonly minimumQty: BigNumber;
}
