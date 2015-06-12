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

module.exports = stack;
