/**
 * Module Dependencies
 */

var keys = Object.keys;

/**
 * Traversal methods
 */

var methods = {
  up: 'backrefs',
  down: 'edges'
};

/**
 * Export `Graph`
 */

module.exports = Graph;

/**
 * Initialize `Graph`
 */

function Graph() {
  if (!(this instanceof Graph)) return new Graph();
  this.nodes = {};
}

/**
 * put
 */

Graph.prototype.put = function(key, value) {
  value = undefined === value ? NaN : value;

  // update nodes, don't remove links
  if (this.nodes[key]) {
    this.nodes[key].value = value;
    return this;
  }

  this.nodes[key] = {
    value: value,
    backrefs: [],
    edges: []
  };

  return this;
};

/**
 * link
 */

Graph.prototype.link = function(from, to) {
  if (!this.nodes[from]) this.put(from);

  if (typeof to === 'string') to = [to]

  for (var i = 0, node; node = to[i]; i++) {
    if (!this.nodes[node]) this.put(node);
    if (!~this.nodes[from].edges.indexOf(node)) this.nodes[from].edges.push(node);
    if (!~this.nodes[node].backrefs.indexOf(from)) this.nodes[node].backrefs.push(from);
  }

  return this;
};

/**
 * unlink
 */

Graph.prototype.unlink = function(from, edges) {
  var nodes = this.nodes;

  var node = nodes[from];
  if (!node) return this;

  if (arguments.length == 1) {
    edges = node.edges;
    for (var i = 0, edge; edge = edges[i]; i++) {
      nodes[edge].backrefs.splice(from, 1);
    }
    node.edges = []
  } else if (typeof edges == 'string') {
    nodes[edges].backrefs.splice(from, 1)
    node.edges.splice(edges, 1);

  } else {
    for (var i = 0, edge; edge = edges[i]; i++) {
      nodes[edge].backrefs.splice(from, 1);
      node.edges.splice(edge, 1);
    }
  }

  // eliminate backrefs on `from` node
  var backrefs = node.backrefs;
  for (var i = 0, backref; backref = backrefs[i]; i++) {
    nodes[backref].edges.splice(from, 1);
  }
  node.backrefs = [];

  return this;
};

/**
 * del
 */

Graph.prototype.del = function(key) {
  this.unlink(key)
  delete this.nodes[key];
  return this;
};

/**
 * get
 */

Graph.prototype.get = function(key) {
  return this.nodes[key] ? this.nodes[key].value : NaN;
};

/**
 * exists
 */

Graph.prototype.exists = function(key) {
  return !!this.nodes[key];
};

/**
 * Setup the traversal methods
 */

keys(methods).forEach(function(action) {
  var attrs = methods[action];

  Graph.prototype[action] = function(key, depth, fn, ctx, visiting, visited) {
    if ('function' == typeof depth) {
      ctx = fn;
      fn = depth;
      depth = Infinity;
    }

    // initialize
    visiting = visiting || {};
    visited = visited || {};

    if (!depth-- || visited[key]) return this;
    else if (visiting[key]) throw new Error(key + ' already visited. graph is cyclical.');
    visiting[key] = true;

    var node = this.nodes[key];
    if (!node) throw new Error(key + ' doesn\'t exist.');

    var arr = node[attrs];
    var parents = {};
    var node;

    if (!arr.length) {
      visited[key] = true;
      delete visiting[key];
      return this;
    }

    for (var i = 0, item; item = arr[i]; i++) {
      if (visited[item] || visiting[item]) continue;
      node = this.nodes[item];
      parents[item] = node.value;
    }

    fn.call(ctx, parents, key);

    for (var i = 0, item; item = arr[i]; i++) {
      this[action](item, depth, fn, ctx, visiting, visited);
    }

    visited[key] = true;
    delete visiting[key];

    return this;
  }
})

var visit = function (key, sorted, visited, visiting, dir, graph) {
  if (visiting[key]) throw new Error('Graph is not acyclic')
  if (visited[key]) return
  visiting[key] = true
  graph.nodes[key][methods[dir]].forEach(function (edge) {
    visit(edge, sorted, visited, visiting, dir, graph)
  })
  visited[key] = true
  visiting[key] = false
  sorted.unshift(key)
}

Graph.prototype.upsorted = function (keys) {
  if (!keys) keys = Object.keys(this.nodes)
  return this._sorted(keys, 'up')
}

Graph.prototype.downsorted = function (keys) {
  if (!keys) keys = Object.keys(this.nodes)
  return this._sorted(keys, 'down')
}

Graph.prototype._sorted = function (keys, dir) {
  if (typeof keys === 'string') keys = [keys]
  else if (typeof keys === 'object' && !Array.isArray(keys)) keys = Object.keys(keys)
  dir = dir || 'down'
  var sorted = []
  var visiting = {}
  var visited = {}
  keys.forEach(function (key) {
    visit(key, sorted, visited, visiting, dir, this)
  }, this)
  return sorted
}

/**
 * toString
 */

Graph.prototype.toString = function() {
  return JSON.stringify(this.nodes, true, 2)
};
