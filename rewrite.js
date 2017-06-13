const recast = require('recast');
const parser = require('babylon');

function withinAsyncContext(c) {
  return `(async () => { ${c} })()`;
}

function leakLocals(nodes) {
  return nodes.map(node => {
    if (node.type !== 'VariableDeclaration') {
      return node;
    }
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions: node.declarations.map(declaration => ({
          type: 'AssignmentExpression',
          operator: '=',
          left: declaration.id,
          right: declaration.init
        }))
      }
    };
  });
}

module.exports = function(code) {
  let ast = recast.parse(withinAsyncContext(code), { parser });
  let userBlock = ast.program.body[0].expression.callee.body;
  let userCode = userBlock.body;
  if (userCode.length > 0 && userCode[userCode.length - 1].type === 'ExpressionStatement') {
    userCode[userCode.length - 1] = {
      type: 'ReturnStatement',
      argument: userCode[userCode.length - 1]
    };
  }
  userBlock.body = leakLocals(userCode);
  return recast.print(ast).code;
};
