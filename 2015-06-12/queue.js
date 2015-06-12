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

module.exports = queue;
