## [RC S1'17] Second day at RC (-105)

### TDD JS pairing 

Paired explaining TDD on a simple recurse Fibonacci number implementation, then
modelled a glass of water, which could be filled / emptied and then a drunkard,
who can throw the glass, and depending on the surface that it hits it either
shatters or bounce.


### Clojure learning

Started Clojure Applied.


### Haskell learning

#### Equational reasoning problem

> Started by approaching this problem suggested by a fellow recurser.
> 
> Consider the following definitions of `append` and `rev` in Haskell (one can, however,
> do this in any functional language).
> 
> ```haskell
> append :: [a] -> [a] -> [a]
> append []     ys = ys
> append (x:xs) ys = x:(append xs ys)
> ```

Recursively extracts the first element of the `xs` list and appends to it
the remainder of `xs` and `ys`.
`:` is "cons" in Haskell land.
It looks like `:` only works if the left parameter is not a list, but it's
ok for the second to be a list.

> ```haskell
> rev :: [a] -> [a]
> rev []     = []
> rev (x:xs) = append (rev xs) [x]
> ```
`(x:xs)` binds the names

Recursively extracts the first element of the `xs` list appending it at the end.

> This implementation of rev works quite well for smaller sized lists. However, on
> larger lists, its performance suffers quite a bit (due to the fact that it also 
> calls another recursively defined function, append).
> We can improve its performance using "equational reasoning" to remove the
> dependency of rev on append. First, let's define a function that takes two lists,
> reverses the first list and then appends the two lists together.
> 
> ```
> appendRev :: [a] -> [a] -> [a]
> appendRev xs ys = append (rev xs) ys
> ```
> 
> Exercises:
> 
> As an example, I've included the solution to the first exercise.
> 
> 1. Calculate `appendRev [] ys` for any list `ys`. Use substitution.
> appendRev [] ys
> == append (rev []) ys       (def of appendRev)
> == append [] ys             (def of rev)
> == ys                       (def of append)
> 
> 2. Calculate appendRev (x:xs) ys in a similar manner.
>
> 3. Reimplement appendRev using (1) and (2).
>
> 4. Reimplement rev to use appendRev from (3).
> 
> To see this in action, open a GHCi repl, then type the following:
> *> :set +s
> Then run rev on a large list (e.g. [1..5000]). Compare the time it took to complete the computation using the two implementations of rev.

#### Simple web - server architecture to evaluate Haskell snippets

The idea is to have an interactive website where you could check out the examples and 
modify them as needed to grasp the details in a complete way.

I think one thing that could be done is temporarily use tryhaskell.org/eval endpoint to see
if our idea of having an interactive website would work.


### Plans for tomorrow

 * finish the Haskell exercises, with some advice; also finish preparing the environment
 * have a look at the [clojure mutation testing library](https://github.com/ds2643/mutcl)
 * pair some more
 * work on algorithms and data structures (read, understand, implement)
