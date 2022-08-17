import type { NewOrderRequest, OrderPreview } from '../models/index';

export const isOrderPreview = (orderBody: NewOrderRequest['orderBody']): orderBody is OrderPreview => {
  return typeof orderBody.symbol === 'string' && typeof orderBody.side === 'string'
    && !!(orderBody as OrderPreview).from && !!(orderBody as OrderPreview).to;
};
