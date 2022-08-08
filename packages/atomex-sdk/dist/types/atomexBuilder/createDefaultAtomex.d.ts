import type { Atomex } from '../atomex/index';
import type { DeepReadonly } from '../core/index';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
export declare const createDefaultMainnetAtomex: (options?: DeepReadonly<Omit<AtomexBuilderOptions, 'atomexNetwork'>>) => Atomex;
export declare const createDefaultTestnetAtomex: (options?: DeepReadonly<Omit<AtomexBuilderOptions, 'atomexNetwork'>>) => Atomex;
