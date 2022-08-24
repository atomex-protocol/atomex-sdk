/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OverloadParameters, OverloadReturnType } from '../../../src/core';
import { ExchangeManager } from '../../../src/index';

export class MockExchangeManager extends ExchangeManager {
  getOrder = jest.fn<ReturnType<ExchangeManager['getOrder']>, Parameters<ExchangeManager['getOrder']>>(
    (...args: Parameters<ExchangeManager['getOrder']>) => super.getOrder(...args)
  );
  getOrders = jest.fn<ReturnType<ExchangeManager['getOrders']>, Parameters<ExchangeManager['getOrders']>>(
    (...args: Parameters<ExchangeManager['getOrders']>) => super.getOrders(...args)
  );
  addOrder = jest.fn<ReturnType<ExchangeManager['addOrder']>, Parameters<ExchangeManager['addOrder']>>(
    (...args: Parameters<ExchangeManager['addOrder']>) => super.addOrder(...args)
  );
  cancelOrder = jest.fn<ReturnType<ExchangeManager['cancelOrder']>, Parameters<ExchangeManager['cancelOrder']>>(
    (...args: Parameters<ExchangeManager['cancelOrder']>) => super.cancelOrder(...args)
  );
  cancelAllOrders = jest.fn<ReturnType<ExchangeManager['cancelAllOrders']>, Parameters<ExchangeManager['cancelAllOrders']>>(
    (...args: Parameters<ExchangeManager['cancelAllOrders']>) => super.cancelAllOrders(...args)
  );

  getSymbol = jest.fn<ReturnType<ExchangeManager['getSymbol']>, Parameters<ExchangeManager['getSymbol']>>(
    (...args: Parameters<ExchangeManager['getSymbol']>) => super.getSymbol(...args)
  );
  getSymbols = jest.fn<ReturnType<ExchangeManager['getSymbols']>, Parameters<ExchangeManager['getSymbols']>>(
    (...args: Parameters<ExchangeManager['getSymbols']>) => super.getSymbols(...args)
  );

  getTopOfBook = jest.fn<OverloadReturnType<ExchangeManager['getTopOfBook']>, OverloadParameters<ExchangeManager['getTopOfBook']>>(
    (...args: OverloadParameters<ExchangeManager['getTopOfBook']>) => (super.getTopOfBook as any)(...args)
  );
  getOrderBook = jest.fn<OverloadReturnType<ExchangeManager['getOrderBook']>, OverloadParameters<ExchangeManager['getOrderBook']>>(
    (...args: OverloadParameters<ExchangeManager['getOrderBook']>) => (super.getOrderBook as any)(...args)
  );

  getOrderPreview = jest.fn<ReturnType<ExchangeManager['getOrderPreview']>, Parameters<ExchangeManager['getOrderPreview']>>(
    (...args: Parameters<ExchangeManager['getOrderPreview']>) => super.getOrderPreview(...args)
  );
  getAvailableLiquidity = jest.fn<ReturnType<ExchangeManager['getAvailableLiquidity']>, Parameters<ExchangeManager['getAvailableLiquidity']>>(
    (...args: Parameters<ExchangeManager['getAvailableLiquidity']>) => super.getAvailableLiquidity(...args)
  );
}
