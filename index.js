'use strict';

var format  = require('util').format;
var assert  = require('assert');
var assign  = require('object-assign');
var winston = require('winston');

var container;

function Log(namespace) {
  // If it's called without new, still return a new instance.
  if (!(this instanceof Log)) { return new Log(namespace); }

  // Make sure the namespace is a string
  assert(
    typeof namespace === 'string' || namespace instanceof String,
    format('log namespace must be a string: %j given', namespace)
  );

  // Configure Log if it hasn't already
  if (!container) { Log.configure(); }

  // This is the logger instance
  var logger = container.add(namespace);

  // This gets all of the log levels and applies them to this
  Object.keys(logger.levels).map(function (level) {
    this[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(format('[%s]', namespace));
      logger[level].apply(logger, args);
    };
  }, this);

}


Log.configure = function configure(options) {
  assert(
    !container,
    'logget has already been configured'
  );

  container = new winston.Container(options);

};

Log.addTransport = function (transport, options) {
  winston.add(transport, options);
};

Object.defineProperty(Log, 'transports', {
  value: winston.transports
});

module.exports = Log;
