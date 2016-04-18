# logget

[![NPM version](http://img.shields.io/npm/v/logget.svg?style=flat)](https://www.npmjs.org/package/logget)
[![Dependency Status](http://img.shields.io/david/ksmithut/logget.svg?style=flat)](https://david-dm.org/ksmithut/logget)
[![Dev Dependency Status](http://img.shields.io/david/dev/ksmithut/logget.svg?style=flat)](https://david-dm.org/ksmithut/logget#info=devDependencies&view=table)
[![Code Climate](http://img.shields.io/codeclimate/github/ksmithut/logget.svg?style=flat)](https://codeclimate.com/github/ksmithut/logget)
[![Build Status](http://img.shields.io/travis/ksmithut/logget/master.svg?style=flat)](https://travis-ci.org/ksmithut/logget)
[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/ksmithut/logget.svg?style=flat)](https://codeclimate.com/github/ksmithut/logget)

A simple wrapper around [`winston`](https://github.com/winstonjs/winston) that
helps give context to your logs.

### Deprecated. Opt to use winston or bunyan directly.

# Installation

```bash
npm install --save logget
```

# Usage

Simple usage:

The object that gets returned can be used like a winston logger instance.

```js
var log = require('logget')();

log.silly('silly log');
log.debug('debugging all the things');
log.verbose('blah blah blah');
log.info('logging stuff...');
log.warn('hey shouldn\'t we fix that?');
log.error('release the kraken');
```

Advanced usage:

If you pass in a string to the function, it will prefix your messages with that
string wrapped around square brackets.

```js
// app.js
var log = require('logget')('app');
log.info('testing'); // Will log out "info: [app] testing"

// model.js
var log = require('logget')('model');
log.info('testing'); // Will log out "info: [model] testing"
```

Expert usage:

You can customize what transports, log levels, level colors, and anything else
you can pass into `new winston.Logger()`.

```js
var Log = require('logget');
// You can only call .configure once, and it must be before you make a new log.
Log.configure({
  transports: [
    new Log.transports.Console({colorize: true})
  ],
  levels: {
    foo: 0,
    bar: 1,
    baz: 2,
    foobar: 3
  },
  colors: {
    foo: 'green',
    bar: 'blue',
    baz: 'yellow',
    foobar: 'red'
  }
});

// now in this file or any other that gets `required` after this one:
var log = require('logget')();
log.foo('bar');
log.bar('foo');
log.baz('zab');
log.foobar('hello world');
```
