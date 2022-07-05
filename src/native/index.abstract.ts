if (process?.env?.NODE_ENV !== 'test')
  throw new Error('This module should\'t be included to the final bundle');

export * from './index.node';
