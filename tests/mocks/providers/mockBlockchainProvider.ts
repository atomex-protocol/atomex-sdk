import { AtomexBlockchainProvider } from '../../../src/blockchain';

export class MockBlockchainProvider extends AtomexBlockchainProvider {
  addBlockchain = jest.fn<ReturnType<AtomexBlockchainProvider['addBlockchain']>, Parameters<AtomexBlockchainProvider['addBlockchain']>>(
    (...args: Parameters<AtomexBlockchainProvider['addBlockchain']>) => super.addBlockchain(...args)
  );

  getNetworkOptions = jest.fn<ReturnType<AtomexBlockchainProvider['getNetworkOptions']>, Parameters<AtomexBlockchainProvider['getNetworkOptions']>>(
    (...args: Parameters<AtomexBlockchainProvider['getNetworkOptions']>) => super.getNetworkOptions(...args)
  );

  getReadonlyToolkitMock = jest.fn<ReturnType<AtomexBlockchainProvider['getReadonlyToolkit']>, Parameters<AtomexBlockchainProvider['getReadonlyToolkit']>>(
    (...args: Parameters<AtomexBlockchainProvider['getReadonlyToolkit']>) => super.getReadonlyToolkit(...args)
  );
  getReadonlyToolkit<Toolkit = unknown>(toolkitId: string, blockchain?: string | undefined): Promise<Toolkit | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.getReadonlyToolkitMock(toolkitId, blockchain) as any;
  }

  getCurrency = jest.fn<ReturnType<AtomexBlockchainProvider['getCurrency']>, Parameters<AtomexBlockchainProvider['getCurrency']>>(
    (...args: Parameters<AtomexBlockchainProvider['getCurrency']>) => super.getCurrency(...args)
  );

  getNativeCurrencyInfo = jest.fn<ReturnType<AtomexBlockchainProvider['getNativeCurrencyInfo']>, Parameters<AtomexBlockchainProvider['getNativeCurrencyInfo']>>(
    (...args: Parameters<AtomexBlockchainProvider['getNativeCurrencyInfo']>) => super.getNativeCurrencyInfo(...args)
  );

  getCurrencyInfo = jest.fn<ReturnType<AtomexBlockchainProvider['getCurrencyInfo']>, Parameters<AtomexBlockchainProvider['getCurrencyInfo']>>(
    (...args: Parameters<AtomexBlockchainProvider['getCurrencyInfo']>) => super.getCurrencyInfo(...args)
  );
}
