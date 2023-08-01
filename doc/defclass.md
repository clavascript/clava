# Defclass

Since squint `v0.1.15` is it possible to define JavaScript classes, using the
`defclass` syntax.  Here is an example that should show most of what is
possible. The syntax is inspired by
[shadow-cljs](https://clojureverse.org/t/modern-js-with-cljs-class-and-template-literals/7450).

``` clojure
(ns my-class
  (:require [squint.core :refer [defclass]]))

(defclass class-1
  (field -x)
  (field -y :dude) ;; default
  (constructor [this x] (set! -x x))

  Object
  (get-name-separator [_] (str "-" -x)))

(defclass Class2
  (extends class-1)
  (field -y 1)
  (constructor [_ x y]
               (super (+ x y -y)))

  Object
  (dude [_]
        (str -y (.get-name-separator (js* "super"))))

  (toString [this] (str "<<<<" (.dude this) ">>>>") ))

(def c (new Class2 1 2))
```

## Lit

See [squint-lit-example](https://github.com/squint-cljs/squint-lit-example/blob/main/my_element.cljs) on how to use squint together with [lit](https://lit.dev/).
Or check out [web-components-squint](https://github.com/shvets-sergey/web-components-squint) for a more elaborate example.
