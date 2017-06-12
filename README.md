# async-repl

This uses the native async/await support in Node 7.x and newer to let you `await` promises in the repl ("read-eval-print-loop" -- the interactive Node command line).

## Install

`npm install -g async-repl`

## Example

```
$ async-repl
async> 1
1
async> 1 + 2
3
async> 1 + await new Promise(r => setTimeout(() => r(2), 1000))
3
async> x = 1 + await new Promise(r => setTimeout(() => r(2), 1000))
3
async> x
3
async> typeof x
'number'
async>
```

## Caveats

This tool only supports expressions, not statements. So you can't do things like:

    for (let i = 0; i < 10; i++) { console.log(i) }
    
It also doesn't support multi-line input.
