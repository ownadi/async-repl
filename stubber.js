const history = require('repl.history');
const os = require('os');
const path = require('path');
const historyFile = path.join(os.homedir(), '.async_repl_history');
const rewrite = require('./rewrite');

module.exports = function(repl){
  const originalEval = repl.eval;
  history(repl, historyFile);
  repl.eval = awaitingEval;

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
}
