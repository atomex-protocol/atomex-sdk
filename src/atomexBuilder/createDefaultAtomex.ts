import type { Atomex } from '../atomex/index';
import type { DeepReadonly } from '../core/index';
import { AtomexBuilder } from './atomexBuilder';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';

export const createDefaultMainnetAtomex = (options?: DeepReadonly<Omit<AtomexBuilderOptions, 'atomexNetwork'>>): Atomex => {
  const builder = new AtomexBuilder({ ...options, atomexNetwork: 'mainnet' });

  return builder.build();
};

export const createDefaultTestnetAtomex = (options?: DeepReadonly<Omit<AtomexBuilderOptions, 'atomexNetwork'>>): Atomex => {
  const builder = new AtomexBuilder({ ...options, atomexNetwork: 'testnet' });

  return builder.build();
};
