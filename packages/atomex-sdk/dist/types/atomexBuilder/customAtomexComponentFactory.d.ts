import type { AtomexContext } from '../atomex/index';
import type { DeepReadonly } from '../core/index';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
export declare type CustomAtomexComponentFactory<Component, DefaultComponentOptions = void> = DefaultComponentOptions extends void ? (atomexContext: AtomexContext, builderOptions: DeepReadonly<AtomexBuilderOptions>) => Component : (atomexContext: AtomexContext, defaultComponentOptions: DefaultComponentOptions, builderOptions: DeepReadonly<AtomexBuilderOptions>) => Component;
