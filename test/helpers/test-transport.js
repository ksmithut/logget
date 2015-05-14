'use strict';

var output = [];

function TestTransport(options) {
  options = options || {};
  this.name = 'testTransport';
  this.level = options.level || 'silly';
}
require('util').inherits(TestTransport, require('winston').Transport);

TestTransport.prototype.log = function (level, msg, meta, cb) {
  output.push({level: level, msg: msg, meta: meta});
  cb(null, true);
};

TestTransport.getOutput = function () {
  var returnObj = output.slice(0);
  output = [];
  return returnObj;
};

module.exports = TestTransport;
