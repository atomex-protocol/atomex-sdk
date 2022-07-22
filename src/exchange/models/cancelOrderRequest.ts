import { Side } from '../../common/models/side';

export interface CancelOrderRequest {
  orderId: number;
  //from/to?
  symbol: string;
  side: Side;
}
