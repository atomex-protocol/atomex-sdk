declare type OverloadProps<TOverload> = Pick<TOverload, keyof TOverload>;
declare type OverloadUnionRecursive<TOverload, TPartialOverload = unknown> = TOverload extends (...args: infer TArgs) => infer TReturn ? TPartialOverload extends TOverload ? never : OverloadUnionRecursive<TPartialOverload & TOverload, TPartialOverload & ((...args: TArgs) => TReturn) & OverloadProps<TOverload>> | ((...args: TArgs) => TReturn) : never;
declare type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<OverloadUnionRecursive<(() => never) & TOverload>, TOverload extends () => never ? never : () => never>;
export declare type OverloadParameters<T extends (...args: any[]) => any> = Parameters<OverloadUnion<T>>;
export declare type OverloadReturnType<T extends (...args: any[]) => any> = ReturnType<OverloadUnion<T>>;
export {};
