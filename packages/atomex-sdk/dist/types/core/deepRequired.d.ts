export declare type DeepRequired<T> = T extends Array<infer V> ? Array<DeepRequired<V>> : T extends Map<infer K, infer V> ? Map<K, DeepRequired<V>> : T extends Set<infer V> ? Set<DeepRequired<V>> : T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    [P in keyof T]-?: DeepRequired<T[P]>;
};
