export * as converters from './converters';
export * as guards from './guards';
export * as atomexUtils from './atomexUtils';
export * as textUtils from './text';

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const prepareTimeoutDuration = (durationMs: number) => Math.min(durationMs, 0x7FFFFFFF);
