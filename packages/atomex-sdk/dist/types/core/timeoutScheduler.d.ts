import type { Disposable } from '../common';
export declare class TimeoutScheduler implements Disposable {
    private readonly timeouts;
    private readonly counterExpirationMs?;
    private counterExpirationWatcherId;
    private actionWatchers;
    private _counter;
    constructor(timeouts: number[], counterExpirationMs?: number | undefined);
    get counter(): number;
    private set counter(value);
    dispose(): Promise<void>;
    setTimeout(action: () => void | Promise<void>): Promise<void>;
    resetCounter(): void;
    private resetCounterExpiration;
}
