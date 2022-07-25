import { CancelAllSide } from '../../common/index';

import { CurrencyDirection } from './index';

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
