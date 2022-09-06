import type { Disposable } from '../common';

export class TimeoutScheduler implements Disposable {
  private counterExpirationWatcherId: ReturnType<typeof setTimeout> | undefined;
  private actionWatchers = new Set<ReturnType<typeof setTimeout>>();
  private _counter = 0;

  constructor(
    private readonly timeouts: number[],
    private readonly counterExpirationMs?: number
  ) { }

  get counter() {
    return this._counter;
  }

  private set counter(value: number) {
    this._counter = value;
  }

  async dispose(): Promise<void> {
    if (this.counterExpirationWatcherId)
      clearTimeout(this.counterExpirationWatcherId);

    this.actionWatchers.forEach(watcher => clearTimeout(watcher));
  }

  setTimeout(action: () => void) {
    if (this.counterExpirationMs)
      this.resetCounterExpiration();

    const timeoutIndex = Math.min(this.counter, this.timeouts.length - 1);
    const timeout = this.timeouts[timeoutIndex];

    const watcherId = setTimeout(() => {
      this.actionWatchers.delete(watcherId);
      clearTimeout(watcherId);
      action();
    }, timeout);
    this.actionWatchers.add(watcherId);

    this.counter++;
  }

  resetCounter() {
    this.counter = 0;
  }

  private resetCounterExpiration() {
    if (this.counterExpirationWatcherId)
      clearTimeout(this.counterExpirationWatcherId);

    this.counterExpirationWatcherId = setTimeout(() => {
      this.resetCounter();
      this.counterExpirationWatcherId = undefined;
    }, this.counterExpirationMs);
  }
}
