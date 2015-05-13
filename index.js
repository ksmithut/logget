'use strict';

var format  = require('util').format;
var assert  = require('assert');
var clone   = require('clone');
var assign  = require('object-assign');
var winston = require('winston');

/**
 * @member Log~loggers
 * @description keeps track of the different namespaced loggers
 */
var loggers = new winston.Container();

/**
 * @member Log~transports
 * @description keeps track of the transports to be used
 */
var transports;

/**
 * @member Log~hasConfigured
 * @description keeps track of whether or not the logger has been initialized
 */
var hasConfigured = false;

/**
 * @function Log~validateNamespace
 * @description Validates a namespace variable
 * @param {string} namespace the namespace variable to validate.
 */
function validateNamespace(namespace) {
  assert(
    typeof namespace === 'string' || namespace instanceof String,
    format('log namespace must be a string: %j given', namespace)
  );
}

/**
 * @class Log
 * @classdesc A wrapper around winston logger for scalable application logging
 */
function Log(namespace) {
  // If it's called without new, still return a new instance.
  if (!(this instanceof Log)) { return new Log(namespace); }

  validateNamespace(namespace);

  if (!hasConfigured) { Log.configure(); }

  var logger = loggers.add(namespace, {transports: transports});
  Object.keys(logger.transports).map(function (transportName) {
    logger.transports[transportName].label = namespace;
  });

  Object.defineProperty(this, '_logger', {get: function () { return logger; }});

}


/**
 * @function Log.configure
 * @description configures the winston logging
 * @param {Object} options
 * @param {string} options.thing
 * @param {Object} transports
 */
Log.configure = function configure(options) {
  assert(!hasConfigured, 'You have already configured logget');
  hasConfigured = true;

  // Default options
  options = assign({
    transports: []
  }, options);

  // Initialize transports
  transports = (options.transports || []);
  transports = Array.isArray(transports) ? transports : [transports];
  // If there were no transports assigned, use the console one by default.
  if (transports.length === 0) {
    transports.push(new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      depth: 5
    }));
  }

};

module.exports = Log;
