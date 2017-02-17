## [RC S1'17] Recursion, folding, and slow learning (-103)

### Finish the Haskell exercise

This is about recursion principles and foldable data structures.

> Let's put the fun in functional programming!
> Consider the definition of the simplest foldable data structure: the Natural
> Number!
> 
> ```haskell
> data Nat = Zero
         > | Add1 Nat
> ```
> 
> How to print natural numbers a nice way :P
> 
> ```haskell
> instance Show Nat where
  > show Zero     = show (0 :: Integer)
  > show (Add1 n) = show $ 1 + (read $ show n)
> ```
>
> A natural number is either Zero or the successor of (i.e., 1 value greater 
> than) another natural number. Think peano numbers. With this, we have defined 
> a data structure that includes all positive integers and as well as 0.
> Let's define some basic functions for Natural Numbers:
> 
> ```haskell
> -- add two natural numbers together.
> plus :: Nat -> Nat -> Nat
> plus Zero     y = y
> plus (Add1 x) y = Add1 (x `plus` y)
> 
> -- multiply two natural numbers.
> times :: Nat -> Nat -> Nat
> times Zero     _ = Zero
> times (Add1 x) y = (x `times` y) `plus` y
> 
> -- pow raises its first argument to the power of the second argument.
> pow :: Nat -> Nat -> Nat
> pow _ Zero     = Add1 Zero
> pow x (Add1 y) = (x `pow` y) `times` x
> ```
> 
> Cool, but nothing really out of the ordinary here. These are just your 
> average, every-day run of the mill recursively defined functions, but we can
> make things a bit more interesting.
> Consider the following definition of foldNat, which behaves exactly like a 
> reducer (i.e., a recursion principle) for natural numbers.
> Any data structure that is defined similarly to natural numbers (e.g. Lists) 
> has a corresponding fold function. Looking at its type definition, `foldNat`
> takes an `a`, a function of type `a -> a`, a `Nat` and returns an `a`. 
>
> One should think of a as equivalent to any type, which makes `foldNat` an 
> example of a polymorphic function. I will write more about those later on :)
>
> Essentially, the job of `foldNat` is to take any natural number into the 
> appropriate `a`. For example, reading the first line of `foldNat` says that:
> In the event that `n` is the natural number `Zero`, `foldNat` should return
> base.
> Consequently, the second line of `foldNat` is called in the event that the 
> given `n` is not `Zero` but is instead the `Add1` of another natural number 
> `n`.
>
> Thus, `foldNat` would then recur on the smaller natural number, `n`, resulting
> in an `a` which is then passed to `recur` that does whatever it is it's meant
> to do. The real magic that happens is mostly contained within the function 
> `recur` passed to `foldNat` (hint hint).
> 
> ```haskell
> foldNat :: a -> (a -> a) -> Nat -> a
> foldNat base recur Zero     = base
> foldNat base recur (Add1 n) = recur $ foldNat base recur n
> ```
> 
> To further understand what exactly `foldNat` is meant to do, I've included
> some exercises! As an example, I've done the first of these.
> For those who want a little bit more, I've also included a bonus question to 
> define factorial (fact) in terms of foldNat.
> Good luck!
> 
> Hint: You may find it useful to define a few natural numbers to avoid having 
> to write out a long series of Add1s every time you want to test your functions. For example:
> 
> ```haskell
> two :: Nat
> two = Add1 (Add1 Zero)
> 
> five :: Nat
> five = Add1 (Add1 (Add1 (Add1 (Add1 Zero))))
> ```
> 
> Exercises:

> ```haskell
> -- 1. Define `plusFold` that behaves like `plus` but uses `foldNat`.
> ```
```haskell
plusFold :: Nat -> Nat -> Nat
plusFold m n = foldNat n Add1 m
```

> ```haskell
> -- 2. Define `timesFold` that behaves like `times` but uses `foldNat`.
> ```
```haskell
timesFold :: Nat -> Nat -> Nat
timesFold m n = foldNat Zero (\nat -> nat + n) m
```

> ```haskell
> -- 3. Define `powFold` that behaves like `pow` but uses `foldNat`.
> ```
```haskell
powFold :: Nat -> Nat -> Nat
powFold m n = foldNat (Add1 Zero) (\nat -> nat `times` m) n
```

> ```haskell
> -- BONUS!! This is rather difficult...
> fact :: Nat -> Nat
> fact Zero     = Add1 Zero
> fact (Add1 n) = (Add1 n) `times` (fact n)
> 
> factFold :: Nat -> Nat
> factFold = undefined
```

In JavaScript this is how I would sum all the numbers in an array

```JavaScript
[1, 2, 3].reduce((acc, n) => { acc + n }, 0)
```

While in Haskell I would

```Haskell
foldr 0 (\ acc n -> acc + n) [1,2,3]
```

The following is the definition of an integer function

```Haskell
int :: Nat -> Int
int Zero     = 0
int (Add1 n) = (int n) + 1
```

...while this would be the same using `foldNat`.

```Haskell
intFold :: Nat -> Int
intFold n = foldNat 0 (\ int -> int + 1) n
```

How you would define a list:

```Haskell
data List a = Nil
            | Cons a (List a)
```

### Attend first meeting of the webapp security group

Secure software is a subset of correct software.

#### Injection vulnerability

Always escape in the context of the intended use.

Types of injection:

 * Injecting text with special meaning (SQL injection).
 * Injecting text interpreted specially by the browser (XSS).
 
[Content Security Policy](https://content-security-policy.com/) helps 
mitigating (TODO research this a bit more)

#### Hashing

An example could be a function that given n number multiplies them together,
to obtain a number m, reversing the process is somewhat as difficult as, given
the final number, come up to the original numbers that were multiplied.

16 * 54 * 22 * 78 = 1482624

So given 1482624 it's difficult to come back to 16 54 22 78.

#### Salt

Plain text value that is hashed with the password, salting breaks rainbow tables,
the purpose could be having no two password be the same in a database.

#### Cross site request forgery

Type of malicious exploit of a website where unauthorized commands are 
transmitted from a user that the website trusts.

Using a token in web pages might help prevent.


### Have haste server running

After a day and a half intermimttently trying to get `haste-boot` to start
I just gave up, we are probably going to use PureScript or Elm instead.


### Review JS implementation of Quicksort, discuss with study group

My version was ok but this following one in Haskell blew my mind.
I don't think I will ever write Haskell for a living but it's great to get 
exposed to a new way of seeing how things could be implemented.

In this snippet for example we are specifying the recursion step for 
quicksort, and then defining how we compute `xsLess` and `xsMore`.

Quicksort then gets called recursively on the sub arrays.

```haskell
-- thick arrow means constraint on type, a should derive from Ord

q :: (Ord a) => [a] -> [a]
q [] = []
q (x:xs) = xsLess ++ [x] ++ xsMore
  where
    xsLess = q [a | a <- xs, a <= x]
    xsMore = q [a | a <- xs, a > x]
```

Breadth first search -> queue
Depth first search -> stack


### Help a fellow recurser to understand how to use AWS services 

Great conversation on topics that spanned how to make sure you have instances
running to how to bring code from a dev laptop to the production servers,
using continuous delivery.

Explaining things is such a great way to spot right away things you did not 
fully understand, it becomes clear to everyone involved in the conversation
if something is not clear! Also because the next question is bound to be about 
that topic.


### Plans

 * the little schemer
 * look into Clojure mutation testing library 
 * data structures and algorithms study group
 * mock interviews
