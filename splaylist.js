(function(exports) {

var Location = function(value) {
  this._P = null;
  this._L = null;
  this._R = null;
  this._V = value;
};

Location.prototype = {
  val: function() { return this._V; },
  toString: function() {
    var total = {}, k;
    for (k in this) if (k.charAt(0) != '_') total[k] = this[k];
    return this._V.toString() + ' ' +
      JSON.stringify(total).replace(/"(\w+)":/g, "$1:").replace(/\s+/g, ' ');
  }
};

function reorder(tree, X) {
  tree.orderstats(X._V, X, X._L, X._R);
}

function leftRootedRotate(x) {
  //       x                 y
  //     /   \             /   \
  //    L     y           x    RR
  //        /   \       /   \
  //       RL   RR     L    RL
  var y = x._R;
  x._R = y._L;
  if (y._L !== null) y._L._P = x
  y._L = x;
  x._P = y;
  return y;
}

// Left rotation, swaps a node's right child in for the node,
// pushing the node down to the left and fixing up parent pointers.
// Does not update order statistics.
function leftRotate(tree, x) {
  var p = x._P,
      y = leftRootedRotate(x);
  if (p === null) tree._root = y;
  else if (x === p._L) p._L = y;
  else p._R = y;
  y._P = p;
}

// Right rotation without fixing up parents of x; appropriate
// when splaying downward, or when splaying at the root.
function rightRootedRotate(x) {
  //         x            y
  //       /   \        /   \
  //      y     R      LL    x
  //    /   \              /   \
  //   LL   LR            LR    R
  var y = x._L;
  x._L = y._R;
  if (y._R !== null) y._R._P = x
  y._R = x
  x._P = y;
  return y;
}

// Right rotation, swaps a node's left child in for the node,
// pushing the node down to the right and fixing up parent pointers.
// Does not update order statistics.
function rightRotate(tree, x) {
  var p = x._P,
      y = rightRootedRotate(x);
  if (p === null) tree._root = y;
  else if (x === p._L) p._L = y;
  else p._R = y;
  y._P = p;
}

// Splays the node x to the root.
function splayUp(tree, x) {
  for (var p = x._P; p !== null; p = x._P) {
    var g = p._P;
    if (g === null) {
      // Zig right or left.
      if (p._L === x) rightRotate(tree, p); else leftRotate(tree, p);
    } else {
      if (p._L === x && g._L === p) {
        // Zig-zig right.
        rightRotate(tree, g);
        rightRotate(tree, p);
      } else if (p._R === x && g._R === p) {
        // Zig-zig left.
        leftRotate(tree, g);
        leftRotate(tree, p);
      } else if (p._L === x && g._R === p) {
        // Zig-zag right-left.
        rightRotate(tree, p);
        leftRotate(tree, g);
      } else {
        // Zig-zag left-right.
        leftRotate(tree, p);
        rightRotate(tree, g);
      }
      reorder(tree, g);
    }
    reorder(tree, p);
  }
  reorder(tree, x);
}

function findByOrder(tree, key, value) {
  var x = tree._root;
  while (x !== null) {
    var L = x._L, R = x._R, leftval, rightval;
    if (L !== null) {
      leftval = L[key];
      if (value < leftval) {
        x = L;
        continue;
      }
    }
    rightval = x[key];
    if (R !== null) {
      rightval -= R[key];
    }
    if (value < rightval) {
      return x;
    }
    value -= rightval;
    x = R;
  }
  return null;
}

// Global temporary object to avoid allocation.
var globalStub = new Location();

// Splays to root the leftmost node whose order statistic is greater than
// the given value.  For example, ("count", 0, true) will splay to the root
// the leftmost node that has a positive count.  Adapted from:
// https://github.com/montagejs/collections/blob/master/sorted-set.js
// This is the simplified top-down splaying algorithm from: "Self-adjusting
// Binary Search Trees" by Sleator and Tarjan.
function splayByOrder(tree, key, value) {
  var stub, left, right, temp, root, L, R, history, rootsum, found,
      sidesum, sssum;
  if (!tree._root) {
    return false;
  }
  // Create a stub node.  The use of the stub node is a bit
  // counter-intuitive: The right child of the stub node will hold the L tree
  // of the algorithm.  The left child of the stub node will hold the R tree
  // of the algorithm.  Using a stub node, left and right will always be
  // nodes and we avoid special cases.
  // - http://code.google.com/p/v8/source/browse/branches
  //       /bleeding_edge/src/splay-tree-inl.h
  stub = left = right = globalStub;
  root = tree._root;
  rootsum = root[key];
  while (true) {
    L = root._L;
    if (L !== null) {
      sidesum = L[key];
      if (value < sidesum) {
        if (L._L !== null && value < (sssum = L._L[key])) {
          rightRootedRotate(root);
          reorder(tree, root);
          root = L;
          rootsum = sssum;
        } else {
          rootsum = sidesum;
        }
        // link left
        right._L = root;
        root._P = right;
        // right order statistics and right._L are invalid: don't update.
        right = root;
        root = root._L; // Don't null root._P until the end.
        continue;
      }
    }
    R = root._R;
    rootsum = root[key];
    if (R !== null) {
      sidesum = R[key];
      if (value >= rootsum - sidesum) {
        if (R._R !== null && value >= rootsum - (sssum = R._R[key])) {
          leftRootedRotate(root);
          reorder(tree, root);
          root = R;
          value = value - rootsum + sssum;
          rootsum = sssum;
        } else {
          value = value - rootsum + sidesum;
          rootsum = sidesum;
        }
        // link right
        left._R = root;
        root._P = left;
        // left order statistics and left._R are invalid: don't update.
        left = root;
        root = root._R; // Don't null root._P until the end.
        continue;
      } else {
        found = true;
        break;
      }
    } else {
      found = value < rootsum;
    }
    break;
  }
  // reassemble
  root._P = null;
  left._R = root._L;
  if (left._R !== null) left._R._P = left;
  right._L = root._R;
  if (right._L !== null) right._L._P = right;
  root._L = stub._R;
  if (root._L !== null) root._L._P = root;
  root._R = stub._L;
  if (root._R !== null) root._R._P = root;
  // propagate new order statistics
  if (right !== stub) while (right !== null) {
    reorder(tree, right);
    right = right._P;
  }
  if (left !== stub) while (left !== null) {
    reorder(tree, left);
    left = left._P;
  }
  reorder(tree, root);
  tree._root = root;
  return found;
}

function first(tree) {
  var seek = tree._root, prev = null;
  while (seek !== null) {
    prev = seek;
    seek = prev._L;
  }
  return prev
}

function last(tree) {
  var seek = tree._root, prev = null;
  while (seek !== null) {
    prev = seek;
    seek = prev._R;
  }
  return prev
}

function successor(loc) {
  var next = loc._R;
  if (next !== null) {
    for (loc = next._L; loc != null; loc = next._L) {
      next = loc;
    }
  } else {
    for (next = loc._P; next != null && next._R === loc; next = loc._P) {
      loc = next;
    }
  }
  return next;
}

function predecessor(loc) {
  var prev = loc._L;
  if (prev !== null) {
    for (loc = prev._R; loc != null; loc = prev._R) {
      prev = loc;
    }
  } else {
    for (prev = loc._P; prev != null && prev._L === loc; prev = loc._P) {
      loc = prev;
    }
  }
  return prev;
}

function dump(out, node, depth) {
  if (!node) {
    out("null");
    return;
  }
  var result = "";
  if (node._R !== null) {
    result += dump(out, node._R, depth + 1);
  }
  var line = node.toString(),
      prev = node, scan = prev._P, j = depth, rchild, rparent;
  if (scan === null) {
    line = '\u2192' + line;
  } else {
    rchild = (scan._R === prev);
    if (rchild) {
      line = '\u250c\u2574' + line;
    } else {
      line = '\u2514\u2574' + line;
    }
    prev = scan;
    scan = prev._P;
    rparent = rchild;
    while (scan !== null && j > 0) {
      rchild = (scan._R === prev);
      if (rchild === rparent) {
        line = '  ' + line;
      } else {
        line = '\u2502 ' + line;
      }
      prev = scan;
      scan = prev._P;
      j -= 1;
      rparent = rchild;
    }
    line = ' ' + line;
  }
  out(line);
  if (node._L !== null) {
    result += dump(out, node._L, depth + 1);
  }
}

var SplayList = function(orderstats) {
  this._root = null;
  if (orderstats) {
    this.orderstats = orderstats;
  }
};

SplayList.prototype = {

orderstats: function(V, X, L, R) {
  // Override orderstats to add more order statistics.
  // Example:
  // x = new SplayList();
  // x.orderstats = function(V, X, L, R) {
  //   var n = 1, len = V.length;
  //   if (L !== null) { n += L.n; len += L.length; }
  //   if (R !== null) { n += R.n; len += R.length; }
  //   X.n = n; X.length = len;
  // });
  var v = 1;
  if (L !== null) v += L.n;
  if (R !== null) v += R.n;
  X.n = v;
},

each: function(fn) {
  var loc = first(this);
  while (loc !== null) {
    fn(loc);
    loc = successor(loc);
  }
},

nth: function(index) {
  return this.find('n', index);
},

find: function(key, value) {
  /*
  if (null !== (loc = findByOrder(this, key, value))) splayUp(this, loc);
  return loc;
  */
  if (!splayByOrder(this, key, value)) return null;
  return this._root;
},

index: function(location) {
  splayUp(this, location);
  if (location._L === null) return 0;
  return location._L.count;
},

stat: function(key, location) {
  var left = this._root;
  if (location != null) {
    splayUp(this, location);
    left = location._L;
  }
  if (left === null) return 0;
  return left[key];
},

prepend: function(value) {
  var root = new Location(value);
  root._R = this._root;
  if (root._R !== null) root._R._P = root;
  reorder(this, root);
  this._root = root;
  return root;
},

append: function(value) {
  var root = new Location(value);
  root._L = this._root;
  if (root._L !== null) root._L._P = root;
  reorder(this, root);
  this._root = root;
  return root;
},

insertAfter: function(location, value) {
  splayUp(this, location);
  var oldroot = this._root;
  var root = new Location(value);
  root._L = oldroot;
  if (oldroot !== null) {
    oldroot._P = root;
    root._R = oldroot._R;
    if (root._R) root._R.P = root;
    oldroot._R = null;
    reorder(this, oldroot);
  }
  reorder(this, root);
  this._root = root;
  return root;
},

insertBefore: function(location, value) {
  splayUp(this, location);
  var oldroot = this._root;
  var root = new Location(value);
  root._R = oldroot;
  if (oldroot !== null) {
    oldroot._P = root;
    root._L = oldroot._L;
    if (root._L) root._L.P = root;
    oldroot._L = null;
    reorder(this, oldroot);
  }
  reorder(this, root);
  this._root = root;
  return root;
},

remove: function(location) {
  splayUp(this, location);
  if (location._R === null) {
    // assert: this._root === location
    this._root = location._L;
  } else {
    splayUp(successor(this._root));
    // asssert: this._root._L === location
    // asseert: location._R === null
    this._root._L = location._L
    if (this._root._L) this._root._L._P = this._root._L;
    reorder(this, this._root);
  }
},

first: function() { return first(this); },

last: function() { return last(this); },

next: successor,

prev: predecessor,

size: function() {
  if (this._root === null) return 0;
  return this._root.n;
},

toString: function(out) {
  var result = null;
  if ('function' != typeof(out)) {
    result = [];
    out = function(s) { result.push(s); result.push('\n'); }
  }
  dump(out, this._root, 0);
  if (result) {
    return result.join('');
  }
}

};

SplayList.Location = Location;
exports.SplayList = SplayList;

})(
  (typeof module) === 'object' && module.exports || window
);
