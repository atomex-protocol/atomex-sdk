import { CancelAllSide } from '../../common/index';

export interface CancelAllOrdersRequest {
  //from/to?
  symbol: string;
  side: CancelAllSide;
  forAllConnections?: boolean;
}
