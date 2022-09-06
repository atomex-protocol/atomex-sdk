import { wait } from '../../src';
import { TimeoutScheduler } from '../../src/core';

describe('TimeoutScheduler', () => {
  let scheduler: TimeoutScheduler;

  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    scheduler.dispose();
  });

  test('runs scheduled actions and clears timer', async () => {
    let counter = 0;
    const action = () => { counter++; };

    scheduler = new TimeoutScheduler([500, 700]);

    expect(scheduler.counter).toBe(0);
    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(1);
    expect(scheduler.counter).toBe(1);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(1);
    await wait(200);
    expect(counter).toBe(2);
    expect(scheduler.counter).toBe(2);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(2);
    await wait(200);
    expect(counter).toBe(3);
    expect(scheduler.counter).toBe(3);

    scheduler.resetCounter();
    expect(scheduler.counter).toBe(0);
    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(4);
    expect(scheduler.counter).toBe(1);
  });

  test('runs scheduled actions and clears timer automatically', async () => {
    let counter = 0;
    const action = () => { counter++; };

    scheduler = new TimeoutScheduler([500, 700], 1000);

    expect(scheduler.counter).toBe(0);
    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(1);
    expect(scheduler.counter).toBe(1);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(1);
    await wait(200);
    expect(counter).toBe(2);
    expect(scheduler.counter).toBe(2);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(2);
    await wait(200);
    expect(counter).toBe(3);
    expect(scheduler.counter).toBe(3);

    //Wait internal counter expiration
    await wait(1000);
    expect(scheduler.counter).toBe(0);
    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toBe(4);
    expect(scheduler.counter).toBe(1);
  });

  test('waits for action promises', async () => {
    jest.useFakeTimers({ doNotFake: ['setTimeout'] });

    let counter = 0;
    const action = (async () => {
      await wait(100);
      counter++;
    });
    scheduler = new TimeoutScheduler([300]);

    await scheduler.setTimeout(action);
    expect(counter).toBe(1);
    expect(jest.getTimerCount()).toBe(0);

    await scheduler.setTimeout(action);
    expect(counter).toBe(2);
    expect(jest.getTimerCount()).toBe(0);

    await scheduler.setTimeout(action);
    expect(counter).toBe(3);
    expect(jest.getTimerCount()).toBe(0);
  });

  test('stops all scheduled tasks on dispose', () => {
    jest.useFakeTimers();
    const action = jest.fn();
    scheduler = new TimeoutScheduler([10000]);

    scheduler.setTimeout(action);
    scheduler.setTimeout(action);
    scheduler.setTimeout(action);
    expect(jest.getTimerCount()).toBe(3);
    scheduler.dispose();
    expect(jest.getTimerCount()).toBe(0);
  });
});
