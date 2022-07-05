export * as converters from './converters';
export * as atomexUtils from './atomexUtils';
export * as textUtils from './text';

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

