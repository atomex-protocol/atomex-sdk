export interface PublicEventEmitter<T extends readonly unknown[]> {
    addListener(listener: (...args: T) => void): this;
    removeListener(listener: (...args: T) => void): this;
    removeAllListeners(): this;
}

export class EventEmitter<T extends readonly unknown[]> implements PublicEventEmitter<T> {
    private listeners: Set<(...args: T) => void> = new Set();

    addListener(listener: (...args: T) => void) {
        this.listeners.add(listener);
        return this;
    }

    removeListener(listener: (...args: T) => void) {
        if (this.listeners.has(listener))
            this.listeners.delete(listener);
        return this;
    }

    removeAllListeners() {
        this.listeners = new Set();
        return this;
    }

    emit(...args: T) {
        if (!this.listeners.size)
            return;

        if (this.listeners.size === 1) {
            this.listeners.values().next().value(...args);
        } else {
            // We copy listeners to prevent an unbounded loop if there is the adding of a new event handler inside the handler; 
            [...this.listeners].forEach(listener => listener(...args));
        }
    }
}

export type ToEventEmitter<T> = T extends PublicEventEmitter<infer TArgs> ? EventEmitter<TArgs> : never;
export type ToEventEmitters<T> = T extends Record<infer K, PublicEventEmitter<infer TArgs>> ? Record<K, EventEmitter<TArgs>> : never;
