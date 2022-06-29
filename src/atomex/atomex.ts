import type { AuthorizationManager, AuthToken } from '../authorization';
import { CurrenciesProvider } from '../common';
import type { Swap } from '../swaps';
import { type AtomexOptions, type NewSwapRequest, SwapOperationCompleteStage } from './models';

export class Atomex {
  private readonly authorizationManagers: Map<string, AuthorizationManager> = new Map();
  readonly currenciesProvider: CurrenciesProvider;

  constructor(options: AtomexOptions) {
    this.currenciesProvider = options.currenciesProvider;
  }

  async authorize(blockchain: string): Promise<AuthToken> {
    const authorizationManager = this.authorizationManagers.get(blockchain);
    if (!authorizationManager)
      throw new Error(`Authorization manager is not defined for the ${blockchain} blockchain`);

    if (!authorizationManager.isInitialized)
      await authorizationManager.initialize();

    if (authorizationManager.authToken)
      return authorizationManager.authToken;

    return authorizationManager.authorize();
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
