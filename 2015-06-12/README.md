# Breadth first and depth first, same algorithm  different data structure

I am studying data structures in my free time, because I feel like it's a huge gap in my skillset; while I was going through a [hacker rank exercise](https://www.hackerrank.com/challenges/swap-nodes-algo) I thought if it was possible to read a binary tree in [BFS](https://en.wikipedia.org/wiki/Breadth-first_search) and [DFS](https://en.wikipedia.org/wiki/Depth-first_search) just by changing the helper data structure.

Don't take this as correct for granted (and it might as well sound obvious to you) as I'm still studying and there might be errors, in which case please do let me know!

## The idea

BFS uses a queue while DFS uses a stack, provided the two datastructures have the same names we can change them without affecting the code.

## Example

This is the example data structure, a simple binary tree:

```javascript
//        1
//    2       3
//  4       5   6

var root = {
  data: 1,
  left: {
    data: 2,
    left: { data: 4 }
  },
  right: {
    data: 3,
    left: { data: 5 },
    right: { data: 6 }
  }
};
```

## Data structures

For both I've provided a `addChildren` function just because I wanted the results to be always printed left to right, which does not happen if you don't invert the `add`s for the stack.

### Queue

A queue `add`s items at the head and `get`s them from the tail

```javascript
var array = [];
var queue = {
  add: function(o) {
    array.unshift(o);
  },
  addChildren: function(node) {
    if (node.left) queue.add(node.left);
    if (node.right) queue.add(node.right);
  },
  get: function() {
    return array.pop();
  },
  length: function() {
    return array.length;
  }
};
```

### Stack

A stack `add`s element at the head and `get`s them from the tail

```javascript
var array = [];
var stack = {
  add: function(node) {
    array.push(node);
  },
  addChildren: function(node) {
    if (node.right) stack.add(node.right);
    if (node.left) stack.add(node.left);
  },
  get: function() {
    return array.pop();
  },
  length: function() {
    return array.length;
  }
};
```

## Implementation

Given the following implementation we can pass either a stack or a queue as the helper data structure and get the proper results.

```javascript
function search(root, datastructure) {
  datastructure.add(root);
  while (datastructure.length() > 0) {
    var node = datastructure.get();
    if (!node.visited) {
      console.log(node.data);
      datastructure.addChildren(node);
      node.visited = true;
    }
  }
}
```

To test it you could run the following

```javascript
console.log('queue, bfs');
search(root, require('./queue'));
```

or 

```javascript
console.log('stack, dfs');
search(root, require('./stack'));
```
