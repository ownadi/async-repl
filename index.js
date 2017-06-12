#!/usr/bin/env node

const repl = require('repl');
const history = require('repl.history');
const replInstance = repl.start({ prompt: 'async> ' });
const originalEval = replInstance.eval;
const rewrite = require('./rewrite');
const os = require('os');
const path = require('path');
const historyFile = path.join(os.homedir(), '.async_repl_history');

history(replInstance, historyFile);
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
