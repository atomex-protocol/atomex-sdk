import type { AuthorizationManager } from '../authorization/index';
import type { Signer, SignersManager } from '../blockchain/index';
import type { AtomexComponent, CurrenciesProvider, Currency } from '../common/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import type {
  SwapOperationCompleteStage, AtomexBlockchainOptions,
  AtomexOptions, NewSwapRequest
} from './models/index';

export class Atomex implements AtomexComponent {
  readonly authorization: AuthorizationManager;
  readonly exchangeManager: ExchangeManager;
  readonly swapManager: SwapManager;
  readonly signers: SignersManager;

  protected readonly atomexContext: AtomexContext;

  private _isStarted = false;

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

  get isStarted() {
    return this._isStarted;
  }

  async start(): Promise<void> {
    if (this.isStarted)
      return;

    await this.authorization.start();
    await this.exchangeManager.start();
    await this.swapManager.start();

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this.authorization.stop();
    this.exchangeManager.stop();
    this.swapManager.stop();

    this._isStarted = false;
  }

  async addSigner(signer: Signer) {
    await this.signers.addSigner(signer);

    await this.options.blockchains?.[signer.blockchain]?.mainnet.blockchainToolkitProvider?.addSigner(signer);
  }

  addBlockchain(factoryMethod: (context: AtomexContext) => AtomexBlockchainOptions) {
    const blockchainOptions = factoryMethod(this.atomexContext);
    const networkOptions = this.atomexNetwork == 'mainnet' ? blockchainOptions.mainnet : blockchainOptions.testnet;

    if (networkOptions)
      this.atomexContext.providers.blockchainProvider.addBlockchain(networkOptions);
  }

  getCurrency(currencyId: Currency['id']) {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
  async swap(_newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage: SwapOperationCompleteStage): Promise<Swap> {
    throw new Error('Not implemented');
  }
}
