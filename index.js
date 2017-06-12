#!/usr/bin/env node

const repl = require('repl');
const replInstance = repl.start({ prompt: 'async> ' });
const originalEval = replInstance.eval;
const rewrite = require('./rewrite');

replInstance.eval = awaitingEval;

function awaitingEval(cmd, context, filename, callback) {
  try {
    cmd = rewrite(cmd);
  } catch (err) {
    callback(err);
  }
  originalEval.call(this, cmd, context, filename, async function(err,value) {
    if (err) {
      callback.call(this, err, null);
    } else {
      try {
        value = await value;
        callback.call(this, err, value);
      } catch (error) {
        callback.call(this, error, null);
      }
    }
  });
}
