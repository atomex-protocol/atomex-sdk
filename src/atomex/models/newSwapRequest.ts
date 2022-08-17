import type { SwapPreview } from './swapPreview';

export interface NewSwapRequest {
  swapPreview: SwapPreview;
  refundAddress?: string;
  isInitiator?: boolean
}
