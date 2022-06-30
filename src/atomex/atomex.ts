import type { AuthToken } from '../authorization';
import { CurrenciesProvider } from '../common';
import type { Swap } from '../swaps';
import { type AtomexOptions, type NewSwapRequest, SwapOperationCompleteStage } from './models';

export class Atomex {
  protected readonly authorizationManager;
  readonly currenciesProvider: CurrenciesProvider;

  constructor(options: AtomexOptions) {
    this.currenciesProvider = options.currenciesProvider;
    this.authorizationManager = options.authorizationManager;
  }

  async start() {
    await this.authorizationManager.initialize();
  }

  authorize(address: string, forceRequestNewToken = false): Promise<AuthToken> {
    return this.authorizationManager.authorize(address, forceRequestNewToken);
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
