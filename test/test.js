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

  it('should be able to add custom transports', function () {
    Log.addTransport(TestTransport);
    console.log(Log.transports);
  });

});
