import type BigNumber from 'bignumber.js';
import type { Currency, Side } from '../../../common/index';
import type { OrderType } from '../../../exchange/index';
import type { SwapPreviewError } from './swapPreviewError';
import type { SwapPreviewWarning } from './swapPreviewWarning';
export interface SwapPreview {
    readonly type: OrderType;
    readonly from: SwapPreviewDirectionData;
    readonly to: SwapPreviewDirectionData;
    readonly symbol: string;
    readonly side: Side;
    readonly fees: {
        success: readonly SwapPreviewFee[];
        refund: readonly SwapPreviewFee[];
    };
    readonly errors: readonly SwapPreviewError[];
    readonly warnings: readonly SwapPreviewWarning[];
}
export interface SwapPreviewDirectionData {
    readonly address?: string;
    readonly currencyId: Currency['id'];
    readonly price: BigNumber;
    readonly actual: SwapPreviewCurrencyData;
    readonly available: SwapPreviewCurrencyData;
    readonly max?: SwapPreviewCurrencyData;
}
export interface SwapPreviewCurrencyData {
    readonly amount: BigNumber;
    readonly price: BigNumber;
}
export interface SwapPreviewFee {
    readonly name: string;
    readonly currencyId: Currency['id'];
    readonly estimated: BigNumber;
    readonly max: BigNumber;
}
