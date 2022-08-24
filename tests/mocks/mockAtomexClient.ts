import { EventEmitter, OverloadParameters, OverloadReturnType } from '../../src/core/index';
import type { AtomexClient, AtomexNetwork } from '../../src/index';
import { resetAllMocks } from './mockHelpers';

export class MockAtomexClient implements AtomexClient {
  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  private _isStarted = false;

  constructor(readonly atomexNetwork: AtomexNetwork) {
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this._isStarted = false;
  }

  getOrder = jest.fn<ReturnType<AtomexClient['getOrder']>, Parameters<AtomexClient['getOrder']>>();
  getOrders = jest.fn<ReturnType<AtomexClient['getOrders']>, Parameters<AtomexClient['getOrders']>>();
  getSymbols = jest.fn<ReturnType<AtomexClient['getSymbols']>, Parameters<AtomexClient['getSymbols']>>();

  getTopOfBook = jest.fn<OverloadReturnType<AtomexClient['getTopOfBook']>, OverloadParameters<AtomexClient['getTopOfBook']>>();
  getOrderBook = jest.fn<OverloadReturnType<AtomexClient['getOrderBook']>, OverloadParameters<AtomexClient['getOrderBook']>>();

  addOrder = jest.fn<ReturnType<AtomexClient['addOrder']>, Parameters<AtomexClient['addOrder']>>();
  cancelOrder = jest.fn<ReturnType<AtomexClient['cancelOrder']>, Parameters<AtomexClient['cancelOrder']>>();
  cancelAllOrders = jest.fn<ReturnType<AtomexClient['cancelAllOrders']>, Parameters<AtomexClient['cancelAllOrders']>>();

  getSwap = jest.fn<OverloadReturnType<AtomexClient['getSwap']>, OverloadParameters<AtomexClient['getSwap']>>();
  getSwaps = jest.fn<OverloadReturnType<AtomexClient['getSwaps']>, OverloadParameters<AtomexClient['getSwaps']>>();

  getSwapTransactions = jest.fn<ReturnType<AtomexClient['getSwapTransactions']>, Parameters<AtomexClient['getSwapTransactions']>>();

  resetAllMocks() {
    resetAllMocks(this);
  }
}
