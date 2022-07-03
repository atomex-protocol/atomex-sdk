import type { AtomexNetwork } from '../common/index';

export const ensureNetworksAreSame = (
  value1: { atomexNetwork: AtomexNetwork } | AtomexNetwork,
  value2: { atomexNetwork: AtomexNetwork } | AtomexNetwork
) => {
  if ((typeof value1 === 'string' ? value1 : value1.atomexNetwork) === (typeof value2 === 'string' ? value2 : value2.atomexNetwork))
    return;

  throw new Error('Networks are different');
};
