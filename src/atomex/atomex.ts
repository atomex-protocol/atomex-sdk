import type { SignersManager } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { Swap } from '../swaps/index';
import { SwapOperationCompleteStage, type AtomexOptions, type NewSwapRequest } from './models/index';

export class Atomex {
  readonly atomexNetwork: AtomexNetwork;
  readonly authorization;
  readonly signers: SignersManager;

  readonly currenciesProvider: CurrenciesProvider;

  constructor(options: AtomexOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.currenciesProvider = options.providers.currenciesProvider;
    this.signers = options.signersManager;
    this.authorization = options.authorizationManager;
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
