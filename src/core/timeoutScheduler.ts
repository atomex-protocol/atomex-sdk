import type { Disposable } from '../common';

export class TimeoutScheduler implements Disposable {
  private actionCounter = 0;
  private counterExpirationWatcherId: ReturnType<typeof setTimeout> | undefined;
  private actionWatcherId: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly timeouts: number[],
    private readonly counterExpirationMs: number
  ) { }

  async dispose(): Promise<void> {
    if (this.counterExpirationWatcherId)
      clearInterval(this.counterExpirationWatcherId);

    if (this.actionWatcherId)
      clearInterval(this.actionWatcherId);
  }

  setTimeout(action: () => void) {
    this.resetCounterExpiration();

    const timeoutIndex = Math.min(this.actionCounter, this.timeouts.length - 1);
    const timeout = this.timeouts[timeoutIndex];
    this.actionWatcherId = setTimeout(action, timeout);

    this.actionCounter++;
  }

  private resetCounterExpiration() {
    if (this.counterExpirationWatcherId)
      clearInterval(this.counterExpirationWatcherId);

    this.counterExpirationWatcherId = setTimeout(() => {
      this.actionCounter = 0;
      this.counterExpirationWatcherId = undefined;
    }, this.counterExpirationMs);
  }
}
