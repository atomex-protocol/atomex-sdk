export declare type DeepReadonly<T> = T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<K, DeepReadonly<V>> : T extends ReadonlySet<infer V> ? ReadonlySet<DeepReadonly<V>> : T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
};
