export interface BlockchainToolkitProvider<T = unknown> {
    readonly toolkitId: string;
    getReadonlyToolkit(blockchain?: string): Promise<T | undefined>;
}
