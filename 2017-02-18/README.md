## [RC S1'17] Pongo and Perdita (-101)

### Thoughts about a week of daily blogging

I feel good about this. One of the things I've always struggled with is the 
lack of structure in what I am doing, so I feel like this approach is giving
good results for me:

 * some time in the evening to recap 
 * write what I plan to do the next day
 * the next day get the plans and work on those if they still make sense
 
Feels like the exact amount of structure I needed.

### The little schemer

```bash
$ sudo apt-get install mit-scheme
```

I am tracking my progress here: https://github.com/lazywithclass/the-little-schemer


### Move single blog posts to gist

So it's easier to maintain and write, also comments! Also I think they do come
up in Google searches, even though the SEO is far from optimal.

Sadly thre was no easy way to move them... will go hand by hand when I will have time
and won't need brain power.

### Cerebro

#### Calling modules

I figured out how to call modules within ClojureScript

```ClojureScript
;; a.cljs
(ns cerebro.mutations-reader
  (:require [cljs.nodejs :as node]))

(defn answer
  ""
  []
  42)

(set! (.-exports js/module) answer)

;; b.cljs
(ns cerebro.core
  (:require [cljs.nodejs :as node]
            [cerebro.mutations-reader :as reader]))

;; required to print
(node/enable-util-print!)
(println (reader/answer))
```

#### Configuring expression evaluation inside Spacemacs

It wasn't working for me at the start, but it all went together pretty ok.

##### cider-jack-in-clojurescript

I initially an error that looked something like

> `ClassNotFoundException cemerick/piggieback`

So I went and google for it, looks like a library that allows to have a 
ClojureScript REPL on top of nREPL, which is the Clojure one AFAIK.

I've found [this documentation](https://github.com/clojure-emacs/cider/blob/master/doc/up_and_running.md#clojurescript-usage) and followed the steps, basically
I put

```Clojure
:profiles {:dev {:dependencies [[com.cemerick/piggieback "0.2.1"]
                                [org.clojure/tools.nrepl "0.2.10"]]
                 :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}}}
```

in my project.clj, then `M-x customize-variable` `RET` `cider-cljs-lein-repl`, so
I could have nodejs as the default is rhino and I don't want that.

Now I can enjoy `SPC-m-e-e`, such a great way to code.


### Setup a server to host the functional programming website

#### Making sure I can run try.purescript.org on my laptop

I installed cabal (part of the haskell-platform in Ubuntu), then `cabal update` told me 
some packages where missing: 

 * Glob -any,
 * aeson -any,
 * http-types >=0.8.5,
 * purescript ==0.10.5,
 * scotty -any

I proceeded installing all of them

```bash
$ cabal install glob aeson http-types purescript scotty
```

and then

```bash
$ dist/build/trypurescript/trypurescript 8081 'bower_components/purescript-*/src/**/*.purs'
```

correctly started the server, which I tested with 

```bash
curl -X POST localhost:8081/compile --data '1 + 1'
```

which errored, but that means I got it working :b


#### Host setup

Looks like there's no need for a server, I will have to dive more into the details.

Have a look at https://github.com/purescript/trypurescript/issues/64


### Plans

 * see if I can deploy the code onto S3 or if we need a server (assuming we go the PureSript way)
 * lookup timsort heapsort
 * continue working on Cerebro
 * chapter 2 of the little schemer
