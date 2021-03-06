/* globals describe, it, expect, jasmine*/
'use strict';

const Gun = require('gun/gun');
const gun = new Gun({ file: false });
Gun.log.squelch = true;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe('Reticle', function () {

  it('should return the Gun constructor', function () {
    const result = require('../index');
    expect(result).toBe(Gun);
  });

  it('should add a "scope" method to the gun constructor', function () {
    expect(Gun.scope).toEqual(jasmine.any(Function));
  });

  it('should add a "scope" method to the gun chain', function () {
    expect(Gun.chain.scope).toEqual(jasmine.any(Function));
  });

  it('should return the execution context', function () {
    expect(gun.scope('test') instanceof Gun).toBe(true);
  });

  it('should create a new chain', function () {
    expect(gun).not.toBe(gun.scope('new scope'));
  });

  it('should work from a chain context', function (done) {
    const scoped = gun.scope('app').get('hello');
    const unscoped = gun.get('hello').put({
      success: true,
    });
    scoped.get('hello').put({
      success: false,
    });
    unscoped.path('success').val(function (success) {
      expect(success).toBe(true);
      done();
    });
  });

  it('should not collide with other scopes', function (done) {
    const app1 = gun.scope('app 1').get('foo');
    const app2 = gun.scope('app 2').get('foo');
    app1.put({ data: true });
    app2.put({ data: false });

    app1.path('data').val(function (data) {
      expect(data).toBe(true);
      done();
    });
  });

});
