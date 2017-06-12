#!/usr/bin/env node

const repl = require('repl');
const replInstance = repl.start({ prompt: 'async> ' });
const originalEval = replInstance.eval;
replInstance.eval = awaitingEval;

function awaitingEval(cmd, context, filename, callback) {
  cmd = `(async () => ${cmd})()`;
  originalEval.call(this, cmd, context, filename, async function(err,value) {
    if (!err && value && typeof value.then === 'function') {
      value = await value;
    }
    callback.call(this, err, value);
  });
}
