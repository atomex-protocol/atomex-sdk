export interface AtomexService {
  isStarted: boolean;

  start(): Promise<void>;
  stop(): void;
}
