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

This tool doesn't support multi-line input.
