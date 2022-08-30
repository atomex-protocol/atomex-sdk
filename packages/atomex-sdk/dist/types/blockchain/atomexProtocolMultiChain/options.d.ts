import type { Currency } from '../../common/index';
import type { AtomexProtocolOptions } from '../models/index';
export interface AtomexProtocolMultiChainOptions extends AtomexProtocolOptions {
    currencyId: Currency['id'];
    swapContractAddress: string;
    swapContractBlockId?: string;
}
