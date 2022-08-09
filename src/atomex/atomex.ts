import type { AuthorizationManager } from '../authorization/index';
import type { Signer, SignersManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import {
  SwapOperationCompleteStage, AtomexBlockchainOptions,
  AtomexOptions, NewSwapRequest
} from './models/index';

export class Atomex implements AtomexService {
  readonly authorization: AuthorizationManager;
  readonly exchangeManager: ExchangeManager;
  readonly swapManager: SwapManager;
  readonly signers: SignersManager;
  readonly atomexContext: AtomexContext;

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
        this.addBlockchain(_context => [blockchainName, options.blockchains![blockchainName]!]);
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

  addBlockchain(factoryMethod: (context: AtomexContext) => [blockchain: string, options: AtomexBlockchainOptions]) {
    const [blockchain, blockchainOptions] = factoryMethod(this.atomexContext);
    const networkOptions = this.atomexNetwork == 'mainnet' ? blockchainOptions.mainnet : blockchainOptions.testnet;

    if (networkOptions)
      this.atomexContext.providers.blockchainProvider.addBlockchain(blockchain, networkOptions);
  }

  getCurrency(currencyId: Currency['id']) {
    return this.atomexContext.providers.currenciesProvider.getCurrency(currencyId);
  }

  async swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
  async swap(newSwapRequestOrSwapId: NewSwapRequest | Swap['id'], _completeStage = SwapOperationCompleteStage.All): Promise<Swap | readonly Swap[]> {
    if (typeof newSwapRequestOrSwapId === 'number')
      throw new Error('Swap tracking is not implemented yet');

    const orderId = await this.exchangeManager.addOrder(newSwapRequestOrSwapId.accountAddress, newSwapRequestOrSwapId);
    const order = await this.exchangeManager.getOrder(newSwapRequestOrSwapId.accountAddress, orderId);
    if (!order)
      throw new Error(`The ${orderId} order not found`);

    if (order.status !== 'Filled')
      throw new Error(`The ${orderId} order is not filled`);

    const swaps = await Promise.all(order.swapIds.map(swapId => this.swapManager.getSwap(swapId, newSwapRequestOrSwapId.accountAddress)));
    if (!swaps.length)
      throw new Error('Swaps not found');
    if (swaps.some(swap => !swap))
      throw new Error('Swap not found');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return swaps.length === 1 ? swaps[0]! : (swaps as readonly Swap[]);
  }
}
