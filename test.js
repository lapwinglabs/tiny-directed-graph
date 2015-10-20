var assert = require('assert')
var Graph = require('./')
var graph = Graph();

graph.put('a', 53)
graph.put('b')
graph.put('c')
graph.put('d', 2)

graph.link('a', 'b')
graph.link('b', 'c')
graph.link('b', 'd')
graph.link('d', 'e')
graph.link('a', 'e')

graph.up('e', 1, function(k) {
  assert.deepEqual(k, { d: 2, a: 53 })
})

var out = []
graph.down('a', function(obj, k) {
  out.push({ obj: obj, k: k })
})
assert.equal(out.length, 3)

assert.ok(Object.keys(out[0].obj).length, 2)
assert.ok(Number.isNaN(out[0].obj.b))
assert.ok(Number.isNaN(out[0].obj.e))
assert.equal(out[0].k, 'a')

assert.ok(Object.keys(out[1].obj).length, 2)
assert.ok(Number.isNaN(out[1].obj.c))
assert.equal(out[1].obj.d, 2)
assert.equal(out[1].k, 'b')

assert.ok(Object.keys(out[2].obj).length, 1)
assert.ok(Number.isNaN(out[2].obj.e))
assert.equal(out[2].k, 'd')

// Verify topological sorting
assert.deepEqual(graph.downsorted('a'), ['a', 'b', 'd', 'e', 'c'])
assert.deepEqual(graph.upsorted('e', 'up'), ['e', 'd', 'b', 'a'])
assert.deepEqual(graph.downsorted(['d', 'c']), ['c', 'd', 'e'])
assert.deepEqual(graph.downsorted({ b: 1, d: 2 }), ['b', 'd', 'e', 'c'])

// Unlink a node
graph.unlink('b');
assert.deepEqual(graph.downsorted(Object.keys(graph.nodes)), ['d', 'c', 'b', 'a', 'e'])
var reached = []
graph.down('a', function (obj) {
  reached.concat(Object.keys(obj))
})
assert.equal(reached.indexOf('c'), -1)
