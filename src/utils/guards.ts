import isPlainObjectLodashFunction from 'lodash.isplainobject';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isArray = (arg: any): arg is any[] => {
  return Array.isArray(arg);
};

export const isReadonlyArray = (arg: unknown): arg is readonly unknown[] => {
  return Array.isArray(arg);
};

export const isPlainObject = <T extends Record<string, unknown> = Record<string, unknown>>(value: unknown): value is T => {
  return isPlainObjectLodashFunction(value);
};
