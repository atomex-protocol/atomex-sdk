/* eslint-disable @typescript-eslint/no-explicit-any */
import { Atomex, createDefaultTestnetAtomex, legacy } from '../../src/index';
import {
  validXtzToEthSwapInitiatedTransactionValidationTestCases,
  validEthToXtzSwapInitiatedTransactionValidationTestCases
} from './testCases/index';

describe('Legacy : Validation', () => {
  let atomex: Atomex;
  let ethereumHelpers: legacy.EthereumHelpers;
  let tezosHelpers: legacy.TezosHelpers;

  beforeAll(async () => {
    atomex = createDefaultTestnetAtomex();
    ethereumHelpers = await legacy.EthereumHelpers.create(atomex, 'testnet');
    tezosHelpers = await legacy.TezosHelpers.create(atomex, 'testnet');
  });

  test.each(
    validXtzToEthSwapInitiatedTransactionValidationTestCases
  )('validation of initiated transaction [XTZ -> ETH]: %s', async (_, { swap }) => {
    const result = await ethereumHelpers.validateInitiateTransactionBySwap(swap);

    expect(result.status).toBe('Confirmed');
  });

  test.each(
    validEthToXtzSwapInitiatedTransactionValidationTestCases
  )('validation of initiated transaction [ETH -> XTZ]: %s', async (_, { swap }) => {
    const result = await tezosHelpers.validateInitiateTransactionBySwap(swap);

    expect(result.status).toBe('Confirmed');
  });
});
