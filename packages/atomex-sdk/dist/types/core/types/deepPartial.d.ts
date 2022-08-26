export declare type DeepPartial<T> = T extends Array<infer V> ? Array<DeepPartial<V>> : T extends Map<infer K, infer V> ? Map<K, DeepPartial<V>> : T extends Set<infer V> ? Set<DeepPartial<V>> : T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    [P in keyof T]?: DeepPartial<T[P]>;
};
