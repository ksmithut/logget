'use strict';

var expect        = require('chai').expect;
var clearRequire  = require('clear-require');
var TestTransport = require('./helpers/test-transport');

var Log;

function getLog() {
  clearRequire('winston');
  clearRequire('../');
  return require('../');
}

describe('logget', function () {

  beforeEach(function () {
    Log = getLog();
  });

  it('should get logger with default transport', function () {
    Log.configure({transports: [new TestTransport()]});
    var log = new Log('namespace');
    log.info('test');
    log.error('error');
    log.silly({foo: 'bar'});
    log.verbose({foo: 'bar'}, {hello: 'world'});
    expect(TestTransport.getOutput()).to.be.eql([
      {level: 'info', msg: '[namespace] test', meta: {}},
      {level: 'error', msg: '[namespace] error', meta: {}},
      {level: 'silly', msg: '[namespace]', meta: {
        foo: 'bar'
      }},
      {level: 'verbose', msg: '[namespace] { foo: \'bar\' }', meta: {
        hello: 'world'
      }}
    ]);
  });

  it('should get logger without the new keyword', function () {
    /* jshint newcap: false */
    var log = Log('test');
    expect(log).to.be.instanceOf(Log);
  });

  it('should work with instance of string', function () {
    var log = new Log(String('test'));
    expect(log).to.be.instanceOf(Log);
  });

  it('should be able to add custom colors', function () {
    Log.configure({transports: [new TestTransport()]});
    var log = new Log('namespace');
    log.silly('test');
    expect(TestTransport.getOutput()).to.be.eql([
      {level: 'silly', msg: '[namespace] test', meta: {}}
    ]);
  });

  it('should use same logger instance with duplicate namespaces', function () {
    Log.configure({transports: [new TestTransport()]});
    var log = new Log('test');
    var log2 = new Log('test');
    expect(log.logger).to.be.equal(log2.logger);
  });

  it('should use default logger if no namespace is passed', function () {
    Log.configure({transports: [new TestTransport()]});
    var log = new Log();
    log.error('new error');
    expect(TestTransport.getOutput()).to.be.eql([
      {level: 'error', msg: 'new error', meta: {}}
    ]);
  });

  it('should use custom log levels and colors', function () {
    Log.configure({
      transports: [
        new TestTransport({level: 'bar'}),
        new Log.transports.Console({colorize: true, level: 'foo'})
      ],
      levels: {
        foo: 0,
        bar: 1,
        baz: 2,
        foobar: 3
      },
      colors: {
        foo: 'blue',
        bar: 'green',
        baz: 'yellow',
        foobar: 'red'
      }
    });
    var log = new Log();
    expect(log.silly).to.be.equal(undefined);
    log.foo('bar');
    log.bar('foo');
    log.baz('zab');
    log.foobar('hello world');
    expect(TestTransport.getOutput()).to.be.eql([
      {level: 'bar', msg: 'foo', meta: {}},
      {level: 'baz', msg: 'zab', meta: {}},
      {level: 'foobar', msg: 'hello world', meta: {}}
    ]);
  });

});
