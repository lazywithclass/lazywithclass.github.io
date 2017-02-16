## [RC S1'17] (-105)

### Spacemacs basics

Paired explaining Spacemacs basics and how to move around files, lines, and
projects. Got these two awesome commands back from the other person!

`gd` - **g**o to **d**efinition

`C-o` - jumps to previous locations

### Setting up time to talk about interviews

Scheduled time slot this afternoon.

### Haskell

#### Enter Haste!

Found [Haste](http://haste-lang.org/try/) which could help us a lot
in writing our website to learn why haskell matters.

#### Exercises

##### Yesterday

Continuing from yesterday after some advices.

> As an example, I've included the solution to the first exercise.
> 
> 1. Calculate `appendRev [] ys` for any list `ys`. Use substitution.
> appendRev [] ys
> == append (rev []) ys       (def of appendRev)
> == append [] ys             (def of rev)
> == ys                       (def of append)
> 
> 2. Calculate appendRev (x:xs) ys in a similar manner.

```haskell
appendRev (x:xs) ys
== append (rev (x:xs)) ys            (appendRev)
== append (append (rev xs) [x]) ys   (rev)
== ((rev xs) ++ [x]) ++ ys           (using ++ instead of append)
== (rev xs) ++ ([x] ++ ys)           (grouping using associative property)
               append [x] ys         (back to append)
               x:(append [] ys)      (result of append)
== rev xs  ++  x:ys
== append (rev xs) (x:ys)
== appendRev xs (x:ys)               (appendRev)
```

> 3. Reimplement appendRev using (1) and (2).

```haskell
appendRev :: [a] -> [a] -> [a]
appendRev [] ys     = ys
appendRev (x:xs) ys = appendRev xs (x:ys)
```

> 4. Reimplement rev to use appendRev from (3).

```haskell
rev :: [a] -> [a]
rev xs = appendRev xs []
```


### Data structures and algorithms study group

#### Quicksort

##### Theory

Divide and conquer example algorithm:
 
 * base case - simple as possible
 * divide until you get to the base case

`sum([1, 2, 3])`
is the same as
`1 + sum([2, 3])`
and
`1 + 2 + sum([3])`
and
`1 + 2 + 3 + sum([])`
and
`1 + 2 + 3 + 0 = 6`

quicksort []  -> easy
quicksort [1] -> easy
so base case is [] or [1]

^ is the pivot

[ 33, 15, 10 ]
   ^ 

[15, 10]   33 [] <- partitioning step!
            ^

[15, 10]   33 []
  ^

[10] 15 [] 33 []
      ^

10   15    33

done!

so:

1. pick a pivot
2. partition: less than pivot, greater than the pivot
3. recurse on sub arrays!

O(n log n) ... even though worst case takes O(n^2)

the best way to get the average case is to take a random element as the pivot,
half of the times the pivot element will be from the center haf of the sorted
array

you got to be unlucky to always pick the worst pivot, so having randomised 
algorithms is like playing a game that we are always going to win

##### Implementation

```JavaScript
quicksort = (array) => {
  if (array.length <= 1) return array

  let pivotIndex = getPivotIndex(array.length),
      pivot = array[pivotIndex],
      lessThan = [],
      greaterThan = []

  array.forEach((n, index) => {
    if (index === pivotIndex) return
    n <= pivot ? lessThan.push(n) : greaterThan.push(n)
  })

  return quicksort(lessThan)
    .concat([pivot])
    .concat(quicksort(greaterThan));
}

getPivotIndex = n => Math.floor(Math.random() * n)
```


### Pairing on JS using TDD 

Explained the difference between

 * unit tests
 * integration tests
 * smoke tests
 
 when to use them, why, and what benefits do they bring.


### Plans

 * finish the Haskell exercise
 * review JS implementation of Quicksort, discuss with study group
 * look into Clojure mutation testing library 
 * help a fellow recurser to understand how to use AWS services that will help him
 * game night!
