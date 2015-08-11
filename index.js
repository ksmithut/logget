'use strict';

var assert  = require('assert');
var assign  = require('object-assign');
var winston = require('winston');

var DEFAULT_OPTIONS = {
  transports: [
    new winston.transports.Console({
      level: 'silly',
      colorize: true
    })
  ]
};

// This will keep track of the logger. I have considered using a
// winston.Container, but there are configuration limitations to that. I also
// considered building my own container, but then I realized I was creating a
// new logger instance that were doing the same exact thing because I'm just
// working around the issue where label's cannot be different between logger
// instances if they share the same transport
//
// @see https://github.com/winstonjs/winston/issues/629
var logger;

// Log
//
// You create a new log by specifying a namespace. This basically only keeps
// track of the namepace prefix that goes into each log. If nothing is passed,
// then it doesn't prefix it with anything.
function Log(namespace) {
  // If it's called without new, still return a new instance.
  if (!(this instanceof Log)) { return new Log(namespace); }

  // Configure Log if it hasn't already
  if (!logger) { Log.configure(); }

  // This gets all of the log levels and applies them to this
  Object.keys(logger.levels).forEach(function (level) {
    if (!namespace) {
      this[level] = logger[level].bind(logger);
      return;
    }

    this[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[' + namespace + ']');
      logger[level].apply(logger, args);
    };

  }, this);
}

// Log.configure
//
// Configures all of the logs with given transports, levels, and colors, and any
// other settings you would pass into `new winston.Logger()`.
Log.configure = function configure(options) {
  assert(!logger, 'logget has already been configured');
  logger = new winston.Logger(assign({}, options || DEFAULT_OPTIONS));
};

// Log.transports
//
// Exposes winston.transports
Object.defineProperty(Log, 'transports', {
  value: winston.transports
});

module.exports = Log;
