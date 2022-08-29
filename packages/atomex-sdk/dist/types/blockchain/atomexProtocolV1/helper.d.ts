import type { Currency } from '../../common';
import type { PriceManager } from '../../exchange';
import type { AtomexBlockchainProvider } from '../atomexBlockchainProvider';
import type { FeesInfo } from '../models/index';
export declare const getRedeemRewardInNativeCurrency: (currencyOrId: Currency | Currency['id'], redeemFee: FeesInfo, priceManager: PriceManager) => Promise<FeesInfo>;
export declare const getRedeemRewardInToken: (currencyOrId: Currency | Currency['id'], redeemFee: FeesInfo, priceManager: PriceManager, blockchainProvider: AtomexBlockchainProvider) => Promise<FeesInfo>;
