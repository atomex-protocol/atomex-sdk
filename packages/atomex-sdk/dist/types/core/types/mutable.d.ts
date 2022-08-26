export declare type Mutable<T> = T extends ReadonlyMap<infer K, infer V> ? Map<K, V> : T extends ReadonlySet<infer V> ? Set<V> : T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    -readonly [K in keyof T]: T[K];
};
