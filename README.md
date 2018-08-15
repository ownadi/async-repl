# async-repl

This uses the native async/await support in Node 7.x and newer to let you `await` promises in the repl ("read-eval-print-loop" -- the interactive Node command line).

## Install

`npm install -g async-repl`

## Example

```
$ async-repl
async> 1 + 2
3
async> 1 + await new Promise(r => setTimeout(() => r(2), 1000))
3
async> let x = 1 + await new Promise(r => setTimeout(() => r(2), 1000))
undefined
async> x
3
async>
```

## Caveats

* This tool doesn't support multi-line input.
* Top-level object destructuring assignment like:

        let { x } = await someThing()

    doesn't currently work due to a bug in `recast` (see test suite), but you can workaround like:

        ({x} = await someThing())

* We necessarily resolve the top-level expression promise for you, so if you don't want to wait for resolution you should make sure you're not returning the promise as an expression.

        # This will not block because it's a statement
        let myPromise = makePromise()

        # This will block because it's an expression
        otherPromise = makePromise()

        # This will block because now we're using the promise value as an expression
        myPromise

* `const` variables in the repl scope can be overridden

      async> const a = 1
      undefined
      async> a = 2
      2
