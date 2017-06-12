const { expect } = require('chai');
const rewrite = require('../rewrite');
const vm = require('vm');

describe("async rewriting", function() {

  let context;

  beforeEach(function() {
    context = {};
    vm.createContext(context);
  });

  function rewriteAndRun(code) {
    let script = vm.createScript(rewrite(code));
    return script.runInContext(context, { displayErrors: true });
  }

  it("supports regular assignments", async function() {
    let value = await rewriteAndRun('let x = 1');
    expect(value).not.ok;
    expect(context.x).to.equal(1);
  });

  it("supports async assignments", async function() {
    let value = await rewriteAndRun('let x = await 1');
    expect(value).not.ok;
    expect(context.x).to.equal(1);
  });

  it("supports multiple statements", async function() {
    let value = await rewriteAndRun('let x = await 1; let y = await 2; x + y');
    expect(value).to.equal(3);
    expect(context.x).to.equal(1);
    expect(context.y).to.equal(2);
  });

  it("supports plain expressions", async function() {
    let value = await rewriteAndRun('1 + 2');
    expect(value).to.equal(3);
  });

  it("supports expressions with top-level await", async function() {
    let value = await rewriteAndRun('await (1 + 2)');
    expect(value).to.equal(3);
  });


  it("supports expressions with embedded await", async function() {
    let value = await rewriteAndRun('await 1 + await 2');
    expect(value).to.equal(3);
  });

  it("supports await within object literal", async function() {
    let value = await rewriteAndRun('({ a : await 1 })');
    expect(value).to.deep.equal({ a: 1 });
  });

  // This test fails because of
  //    https://github.com/benjamn/recast/issues/412
  it.skip("supports object destructuring assignment", async function() {
    let value = await rewriteAndRun('let { a, b } = { a: 1, b: await 2 }');
    expect(value).not.ok;
    expect(context.a).to.equal(1);
    expect(context.b).to.equal(2);
  });

  it("supports array destructuring assignment", async function() {
    let value = await rewriteAndRun('let [ a, b, ...c ] = [1, await 2, 3, await 4]');
    expect(value).not.ok;
    expect(context.a).to.equal(1);
    expect(context.b).to.equal(2);
    expect(context.c).to.deep.equal([3,4]);
  });


});
