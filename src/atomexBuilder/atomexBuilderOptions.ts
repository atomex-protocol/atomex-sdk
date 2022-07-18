import type { AtomexNetwork } from '../common/index';
import type { DeepMutable, DeepPartial } from '../core/index';
import type { RequiredAuthorizationManagerDefaultComponentOptions, AuthorizationManagerDefaultComponentOptions } from './atomexComponents/index';

export interface AtomexBuilderOptions {
  atomexNetwork: AtomexNetwork;
  authorizationManager?: DeepMutable<RequiredAuthorizationManagerDefaultComponentOptions & DeepPartial<AuthorizationManagerDefaultComponentOptions>>;
}
