import type { AuthorizationManager } from '../authorization/index';
import type { Signer, SignersManager } from '../blockchain/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import type {
  SwapOperationCompleteStage, AtomexBlockchainOptions,
  AtomexOptions, NewSwapRequest
} from './models/index';

export class Atomex {
  readonly authorization: AuthorizationManager;
  readonly exchangeManager: ExchangeManager;
  readonly swapManager: SwapManager;
  readonly signers: SignersManager;

  protected readonly atomexContext: AtomexContext;

  constructor(readonly options: AtomexOptions) {
    this.atomexContext = options.atomexContext;
    this.signers = options.managers.signersManager;
    this.authorization = options.managers.authorizationManager;
    this.exchangeManager = options.managers.exchangeManager;
    this.swapManager = options.managers.swapManager;

    if (options.blockchains)
      for (const blockchainName of Object.keys(options.blockchains))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.addBlockchain(_context => options.blockchains![blockchainName]!);
  }

  get atomexNetwork() {
    return this.atomexContext.atomexNetwork;
  }

  async addSigner(signer: Signer) {
    await this.signers.addSigner(signer);

    await this.options.blockchains?.[signer.blockchain]?.mainnet.blockchainToolkitProvider.addSigner(signer);
  }

  addBlockchain(factoryMethod: (context: AtomexContext) => AtomexBlockchainOptions) {
    const blockchainOptions = factoryMethod(this.atomexContext);
    // TODO
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
