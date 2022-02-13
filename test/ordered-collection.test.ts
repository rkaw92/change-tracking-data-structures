import { GET_CHANGES, OrderedCollection, Props, PropsOf } from '../src';
import * as assert from 'assert/strict';

describe('OrderedCollection', function() {
  it('should report a length of 0 if initialized empty', function() {
    const c = OrderedCollection([]);
    assert.equal(c.size, 0);
  });
  it('should add an element', function() {
    const tasks = OrderedCollection<PropsOf<{ title: string, done: boolean }>>([]);
    tasks.push(Props({ title: 'Water the plants', done: false }));
    assert.equal(tasks.size, 1);
  });
  it('should report having added an element', function() {
    const tasks = OrderedCollection<PropsOf<{ title: string, done: boolean }>>([]);
    tasks.push(Props({ title: 'Water the plants', done: false }));
    assert.deepEqual(tasks[GET_CHANGES]()[0], {
      type: 'add',
      index: 0,
      value: Props({ title: 'Water the plants', done: false })
    });
  });
});
