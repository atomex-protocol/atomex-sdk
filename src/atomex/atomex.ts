import type { AuthToken } from '../authorization/index';
import { CurrenciesProvider } from '../common/index';
import type { Swap } from '../swaps/index';
import { type AtomexOptions, type NewSwapRequest, SwapOperationCompleteStage } from './models/index';

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
