export declare const isArray: (arg: any) => arg is any[];
export declare const isReadonlyArray: (arg: unknown) => arg is readonly unknown[];
export declare const isPlainObject: <T extends Record<string, unknown> = Record<string, unknown>>(value: unknown) => value is T;
