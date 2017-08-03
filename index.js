#!/usr/bin/env node

const repl = require('repl');
const stubber = require('./stubber');
const replInstance = repl.start({ prompt: 'async> ' });
stubber(replInstance);
