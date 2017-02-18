## [RC S1'17] Algorithms data structures, Cerebro, thoughts, and 42 (-102)

### About "giving back to the community"

Honesty warning.

It's not like I am super grateful and I want to give back so much to repay
for all the things I've learned from people, well, also that, but I feel a lot 
that giving back also means testing if I know what I am talking about. Which you 
could argue would ultimately result in better ability to contribute to the 
community.

For example yesterday I was working with a recurser on his idea of a project,
to see which AWS services could help him, while I was speaking it felt like
I could clearly *ding*s in my head when I was talking about something 
I really did not fully understand.<br />
And it's always instantly clear, to every partecipant in the discussion, 
when I'm not sure about something, I've made a resolution that next time I 
speak about something I will keep an ear for that *ding*: when that will happen
I will just note down the subject and a sum of what I've said (at the cost of 
interrupting for a few seconds), this way I think I can progressively close
some of the knowledge gaps I have.

One of the things I am doing at RC is pairing and talking with people,
I think that could help me tremendously in focusing on the weak points.

This is also about stepping out of my comfort zone as I dont
really know how to approach the subjects I study from a "teaching
perspective", so it's really stretching my knowledge and exposing
any defect.

### Cerebro 

I've made an architecture schema so that components for the library are clearer
in my head, I will have:
 
 * an in memory reader for source code, so I don't deal with files (speed)
 * folder will all mutations
 * mutation reader, which requires all mutations and has them ready for usage
 * mutation applier (omg that name), which applies mutations to the in memory 
 source
 * suite runner, which will be testing framework dependent and will know how to 
 run tests, it will then emit a result
 * reporter, will take on the result and print it, initially I would say 
 something like a diff output in the console 

### Data structures and algorithms study group

#### Insertion sort

Good for small arrays, quicksort falls back to this if the array is small 
enough.

#### Selection sort

```
[ 2, 7, 5, 8, 1 ]
  ^
```

Is there an item less than 2? If so swap

```
[ 1, 7, 5, 8, 2 ]
     ^
```

recurse

Left part is the unordered part right side is the ordered part

O(n^2)

#### Bubble sort

```
[ 2, 7, 5, 8, 1 ]
  ^
```

Compare with the next is it less? If so swap

O(n^2)

#### Merge srt

Keeps splitting in half to get subarrays, until you get 1 element arrays.
Then you merge them back comparing and building gradually a sorted array.

Uses more space

O(n logn)

#### Quicksort

[ 8, 6, 7, 5, 3, 0, 4 ]
                    ^
Choose a pivot to partition the array by

Arrange the array so that all the elements less are on the left, greater on
the right

#### Radix sort

##### Counting sort

Used when values are within  specific range
 
[ 1, 4, 1, 2, 7, 5, 2 ]

supposing a range between 0 and 9

```
  0 1 2 3 4 5 6 7 8 9
[ 0 2 2 0 1 1 0 1 0 0 ]
```

sum current value with previous value

```
  0 1 2 3 4 5 6 7 8 9
[ 0 2 2 0 1 1 0 1 0 0 ]
so I get
[ 0 2 4 4 5 6 6 7 7 7 ]
because for example at index 1 and 2 I have 2 and 2 which is 2 + 2 = 4
```

since we have 7 inputs let's create an array with 7 places

```
  1 2 3 4 5 6 7
  
take the first element in [ 1, 4, 1, 2, 7, 5, 2 ], which is 1
now in [ 0 2 4 4 5 6 6 7 7 7 ] at index 1 we have 2 
place 1 in the final array at position 2
[ , 1, , , , , ]
descrease in sum array [ 0 2 4 4 5 6 6 7 7 7 ] so I get [ 0 1 4 4 5 6 6 7 7 7 ]
                           ^                                ^

next is 4, so I go to index 4 in [ 0 1 4 4 5 6 6 7 7 7 ]
                                           ^
So I put 4 at position 5
[ , 1, , , 4, , ]
decrease to get [ 0 1 4 4 4 6 6 7 7 7 ] 

next is 1, so I got to index 1 in [ 0 1 4 4 5 6 6 7 7 7 ]
                                      ^
so I put 1 at position 1
[ 1, 1, , ,4, , ]
decrease to get [ 0 0 4 4 4 6 6 7 7 7 ] 


next is 2, so I got to index 2 in [ 0 1 4 4 5 6 6 7 7 7 ]
                                        ^
so I put 2 at position 4
[ 1, 1, , 2, 4, , ]
decrease to get [ 0 0 4 4 4 6 6 7 7 7 ] 

and so on until I get [ 1, 1, 2, 2, 4, 5, 7]
```

##### How does radix sort work

 * only used to sort numbers
 * sort from least significant digit to most significant
 * when two numbers have the same digit prioritise on original position
 * counting sort as a sorting subroutine 
 
So we use counting sort as subroutine because we exactly know that our digits
are always going to be between 0 and 9.

##### When to use radix sort

If we have log2n bits for every digit, the running time of Radix appears to 
be better than quicksort for a wide range of input numbers. 

So that means that is going to perform better if you have less digits because
you have to go through the array fewer times than a quicksort does.

##### Visual

[ 170, 45, 75, 90, 802, 24, 2, 66 ]

```
[ 170, 45, 75, 90, 802, 24, 2, 66 ]
    ^   ^   ^   ^    ^   ^  ^   ^
[ 170, 90, 802, 2, 24, 45, 75, 66 ]
   ^   ^    ^  ^   ^   ^   ^   ^
[ 802, 2, 24, 45, 66, 170, 75, 90 ]

until you get 

[ 2, 24, 45, 66, 75, 90, 170, 802 ]
```

##### Some code

This is my rather bad implementation, I won't focus anymore on it for now
as it gave enough bad feelings to get stuck almost a day around it, I will
look into this in a few days hopefully.

I tried having a `counting` sort and `radix` sort as separate as they are 
described in the definition, but that did not work in the end.

These are some references I got after my attempts, I am going to leave these here
for later reference:

 * http://stackoverflow.com/questions/36513414/javascript-radix-sortlet
 * http://stackoverflow.com/questions/3817067/radix-sort-in-javascript
 * http://khan4019.github.io/front-end-Interview-Questions/sort.html#radixSort
 * http://codereview.stackexchange.com/questions/144803/implementing-radixsort-using-javascript

```javascript
counting = array => {
  let occurrencies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  array.forEach(n => occurrencies[n]++)
  occurrencies.forEach((n, i) => {
    if (i === 0) return;
    occurrencies[i] += occurrencies[i - 1];
  })

  let sorted = new Array(array.length)
  array.forEach(n => {
    occurrencies[n] = occurrencies[n] - 1
    let position = occurrencies[n]
    sorted[position] = n;
  })
  return sorted
}

let getDigit = (n, pos) => {
  let s = n.toString(), digit = s.charAt(s.length - pos - 1)
  return digit === '' ? 0 : digit
}

let radix = (array, pos) => {
  let mappedArray = array.map(n => getDigit(n, pos))

  let sortedDigits = counting(mappedArray)
  return sortedDigits.map(digit => {
    for (let i = 0; array.length > 0; i++) {
      if (digit == getDigit(array[i], pos)) {
        let number = array[i]
        array.splice(i, 1)
        return number
      }
    }
  })
}

let array = [ 170, 45, 75, 90, 802, 24, 2, 66 ]
array = radix(array, 0)
console.log(array)
array = radix(array, 1)
console.log(array)
array = radix(array, 2)
console.log(array)
```

### Plans

 * the little schemer
 * mutation testing library
 * setup a server to host the functional programming website
 * lookup timsort heapsort
