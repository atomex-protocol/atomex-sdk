export declare type DeepMutable<T> = T extends ReadonlyMap<infer K, infer V> ? Map<K, DeepMutable<V>> : T extends ReadonlySet<infer V> ? Set<DeepMutable<V>> : T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    -readonly [K in keyof T]: DeepMutable<T[K]>;
};
