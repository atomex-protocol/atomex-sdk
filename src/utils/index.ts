import * as atomexUtils from './atomexUtils';
import * as converters from './converters';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export {
  wait,
  converters,
  atomexUtils
};
