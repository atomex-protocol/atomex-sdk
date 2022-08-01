import type { CancelAllSide } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';

interface CancelAllOrdersRequestBase {
  forAllConnections?: boolean;
}

export type CancelAllOrdersRequest = CancelAllOrdersRequestBase & ({
  from: CurrencyDirection['from'];
  to: CurrencyDirection['to'];
  cancelAllDirections?: boolean;
  symbol?: never;
  side?: never;
} | {
  from?: never;
  to?: never;
  symbol: string;
  side: CancelAllSide;
});
