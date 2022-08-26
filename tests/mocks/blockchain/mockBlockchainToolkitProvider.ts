import type { BlockchainToolkitProvider } from '../../../src/blockchain';

export class MockBlockchainToolkitProvider implements BlockchainToolkitProvider {
  constructor(readonly toolkitId: string) {
  }

  getReadonlyToolkit = jest.fn<ReturnType<BlockchainToolkitProvider['getReadonlyToolkit']>, Parameters<BlockchainToolkitProvider['getReadonlyToolkit']>>();
}
