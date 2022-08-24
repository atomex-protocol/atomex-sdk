import type BigNumber from 'bignumber.js';

export interface Accounts {
  ethereum: BlockchainAccounts;
  tezos: BlockchainAccounts;
}

interface BlockchainAccounts {
  [accountAddress: string]: {
    [currencyId: string]: BigNumber;
  }
}
