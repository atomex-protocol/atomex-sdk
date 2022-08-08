import type { SwapTransactionsProvider, Transaction } from '../../blockchain/index';
import type { Swap } from '../../index';

export class TezosSwapTransactionsProvider implements SwapTransactionsProvider {
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

  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }
}
