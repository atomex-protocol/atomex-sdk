import type { ExchangeSymbolsProvider } from '../exchangeSymbolsProvider';
import type { OrderPreviewParameters, NormalizedOrderPreviewParameters, NewOrderRequest, OrderPreview } from '../models';
export declare const isOrderPreview: (orderBody: NewOrderRequest['orderBody']) => orderBody is OrderPreview;
export declare const isNormalizedOrderPreviewParameters: (orderPreviewParameters: any) => orderPreviewParameters is NormalizedOrderPreviewParameters;
export declare const normalizeOrderPreviewParameters: (orderPreviewParameters: OrderPreviewParameters, exchangeSymbolsProvider: ExchangeSymbolsProvider) => NormalizedOrderPreviewParameters;
