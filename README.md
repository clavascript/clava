## ClavaScript

ClavaScript, or clava for friends, is an experimental ClojureScript syntax to
JavaScript compiler.

> :warning: This project is an experiment and not recommended to be used in
> production. It currently has many bugs and will undergo many breaking changes.

## Quickstart

Although it's early days and far from complete, you're welcome to try out `clava` and submit issues.

``` shell
$ mkdir clava-test && cd clava-test
$ npm init -y
$ npm install clavascript@latest
```

Create a `.cljs` file, e.g. `example.cljs`:

``` clojure
(ns example
  (:require ["fs" :as fs]
            ["url" :refer [fileURLToPath]]))

(println (fs/existsSync (fileURLToPath js/import.meta.url)))

(defn foo [{:keys [a b c]}]
  (+ a b c))

(println (foo {:a 1 :b 2 :c 3}))
```

Then compile and run (`run` does both):

```
$ npx clava run example.cljs
true
6
```

Run `npx clava --help` to see all command line options.

## Why Clava

Clava let you write CLJS syntax but emits small JS output, while still having
parts of the CLJS standard library available (ported to mutable data structures,
so with caveats). This may work for small projects e.g. that you'd like to
deploy on CloudFlare workers, node scripts, Github actions, etc. that need the
extra performance and small bundle size.

## Differences with ClojureScript

- Clava does not protect you in any way from the pitfalls of JS with regards to truthiness, mutability and equality
- There is no CLJS standard library. The `"clavascript/core.js"` module has similar JS equivalents
- Keywords are translated into strings
- Maps and vectors are compiled as mutable objects and arrays
- Supports async/await:`(def x (js/await y))`. Async functions must be marked
  with `^:async`: `(defn ^:async foo [])`.
- `assoc!`, `dissoc!`, `conj!`, etc. perform in place mutation on objects
- `assoc`, `dissoc`, `conj`, etc. return a new shallow copy of objects
- `println` is a synonym for `console.log`
- `pr-str` and `prn` coerce values to a string using `JSON.stringify`

### seqs

Clava does not implement Clojure seqs. Instead it uses the JavaScript
[iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
to work with collections. What this means in practice is the following:

- `seq` takes a collection and returns an Iterable of that collection, or nil if it's empty
- `iterable` takes a collection and returns an Iterable of that collection, even if it's empty
- `seqable?` can be used to check if you can call either one

Most collections are iterable already, so `seq` and `iterable` will simply
return them; an exception are objects created via `{:a 1}`, where `seq` and
`iterable` will return the result of `Object.entries`.

`first`, `rest`, `map`, `reduce` et al. call `iterable` on the collection before
processing, and functions that typically return seqs instead return an array of
the results.

## Open questions

- TC39 records and tuples are immutable but not widely supported. It's not yet sure how they will fit within clava.

License
=======

Clava is licensed under the EPL, the same as Clojure core and [Scriptjure](https://github.com/arohner/scriptjure). See epl-v10.html in the root directory for more information.
