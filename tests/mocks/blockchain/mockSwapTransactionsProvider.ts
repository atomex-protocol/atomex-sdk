import type { SwapTransactionsProvider } from '../../../src/index';

export class MockSwapTransactionsProvider implements SwapTransactionsProvider {
  private _isStarted = false;

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

  getSwapTransactions = jest.fn<
    ReturnType<SwapTransactionsProvider['getSwapTransactions']>,
    Parameters<SwapTransactionsProvider['getSwapTransactions']>
  >();
}
