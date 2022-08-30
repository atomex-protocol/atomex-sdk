export { WalletsManager } from './walletsManager';
export { isAtomexProtocolMultiChain, isAtomexProtocolMultiChainApprovable } from './AtomexProtocolMultiChain/index';

export type { AtomexProtocolOptions, AtomexSignature, Transaction, FeesInfo } from './models/index';
export type { AtomexProtocol } from './atomexProtocol';
export type {
  AtomexProtocolMultiChain,
  AtomexProtocolMultiChainApprovable,
  AtomexProtocolMultiChainOptions,
  AtomexProtocolMultiChainInitiateParameters,
  AtomexProtocolMultiChainRedeemParameters,
  AtomexProtocolMultiChainRefundParameters
} from './AtomexProtocolMultiChain/index';
export type { BalancesProvider, CurrencyBalanceProvider } from './balanceProvider/index';
export type { TransactionsProvider } from './transactionsProvider';
export type { BlockchainToolkitProvider } from './blockchainToolkitProvider';
export type { SwapTransactionsProvider } from './swapTransactionProvider';
export type { BlockchainWallet } from './blockchainWallet';
export { AtomexBlockchainProvider, type CurrencyInfo } from './atomexBlockchainProvider';
