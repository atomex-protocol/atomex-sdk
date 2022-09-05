import { wait } from '../../src';
import { TimeoutScheduler } from '../../src/core';

describe('TimeoutScheduler', () => {
  let scheduler: TimeoutScheduler;

  afterEach(() => {
    scheduler.dispose();
  });

  test('runs scheduled actions and clears timer automatically', async () => {
    let counter = 0;
    const action = () => counter++;

    scheduler = new TimeoutScheduler([500, 700], 1000);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toEqual(1);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toEqual(1);
    await wait(200);
    expect(counter).toEqual(2);

    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toEqual(2);
    await wait(200);
    expect(counter).toEqual(3);

    //Wait internal counter expiration
    await wait(1000);
    scheduler.setTimeout(action);
    await wait(500);
    expect(counter).toEqual(4);
  });
});
