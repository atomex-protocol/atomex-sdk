import * as atomexUtils from './atomexUtils';
import * as converters from './converters';

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export {
  converters,
  atomexUtils
};
