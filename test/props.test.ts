import { GET_CHANGES, Props } from '../src';
import * as assert from 'assert/strict';

describe('Record', function() {
  it('should start as empty by default', function() {
    const r = Props({});
    assert.equal(Object.keys(r).length, 0);
  });
  it('should expose existing primitive keys/values', function() {
    const r = Props({ a: 1, foo: 'bar' });
    assert.equal(Object.keys(r).length, 2);
    assert.equal(r.a, 1);
    assert.equal(r.foo, 'bar');
  });
  it('should allow setting a value', function() {
    const r = Props({ counter: 1 });
    r.counter = 100;
    assert.equal(r.counter, 100);
    r.counter++;
    assert.equal(r.counter, 101);
  });
  it('should keep track of a single change', function() {
    const r = Props({ counter: 1 });
    r.counter++;
    assert.equal(r[GET_CHANGES]().length, 1);
  });
  it('should coalesce multiple changes to the same key', function() {
    const r = Props({ counter: 1 });
    r.counter++;
    r.counter++;
    assert.equal(r[GET_CHANGES]().length, 1);
  });
  it('should notice changes by Object.assign()', function() {
    const r = Props({ counter: 1 });
    Object.assign(r, { counter: 42 });
    assert.equal(r[GET_CHANGES]().length, 1);
    assert.equal(r[GET_CHANGES]()[0]!.key, 'counter');
    assert.equal(r[GET_CHANGES]()[0]!.value, 42);
  });
  it('should reject properties not present at initialization time', function() {
    const r = Props({ counter: 1 });
    // @ts-expect-error
    r.extra = 1;
  });
});
