export interface AtomexComponent {
  isStarted: boolean;

  start(): Promise<void>;
  stop(): void;
}
