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
  console.log('up', k);
})

// graph.unlink('b');
// console.log(graph.toString());

graph.down('a', function(obj, k, d) {
  console.log('down', k, d, ' => ', obj);
})

console.log(graph.sorted_down('a'))
