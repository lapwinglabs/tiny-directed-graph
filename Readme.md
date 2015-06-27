# tiny-directed-graph

Little directed graph with backlink support.

## Installation

```js
npm install tiny-directed-graph
```

## Example

```js
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
});
```

## API

### graph = Graph()

Initialize a new Graph.

### graph.put(key, value)

Add a node to the graph with a `key` and `value`

### graph.link(key1, key2)

Link a `key1` => `key2`

### graph.unlink(key1, key2)

Unlink `key1` from `key2`. You can also pass an array of keys to unlink, or if you don't specify `key2`, it will unlink all edges.

### graph.del(key)

Delete a `key` and remove linked

### graph.get(key)

get the `value` for a given `key`

### graph.exists(key)

Check if the node exists

### graph.up(key, [depth], fn)

Walk **up** the graph calling `fn(parents)`, starting at `key`. Optionally supply a `depth`. If no depth is specified, it will walk up the entire graph.

`parents` is an object containing key value pairs of all the parents.

### graph.down(key, [depth], fn)

Walk **down** the graph calling `fn(children)`, starting at `key`. Optionally supply a `depth`. If no depth is specified, it will walk down the entire graph.

`children` is an object containing key value pairs of all the children.

### graph.toString()

Print out the entire graph as JSON.
