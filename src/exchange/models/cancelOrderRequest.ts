import type { Side } from '../../common/models/side';
import type { CurrencyDirection } from './currencyDirection';

interface CancelOrderRequestBase {
  orderId: number;
}

export type CancelOrderRequest = CancelOrderRequestBase & ({
  from: CurrencyDirection['from'];
  to: CurrencyDirection['to'];
  symbol?: never;
  side?: never;
} | {
  from?: never;
  to?: never;
  symbol: string;
  side: Side;
});
