import type { Currency } from '../../common/index';
import type { AtomexProtocolOptions } from '../models/index';

export interface AtomexProtocolV1Options extends AtomexProtocolOptions {
  currencyId: Currency['id'];
  swapContractAddress: string;
  swapContractBlockId?: string;
}
