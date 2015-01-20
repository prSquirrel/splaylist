var SplayList = require('../splaylist').SplayList,
    assert = require('assert');

describe('Splay implementation test', function() {

var x = new SplayList();
for (var j = 0; j < 10; ++j) {
 x.push('node' + j);
}

it('pushes deeply', function() {
assert.equal(x.toString(),
  "━node9 {n:10}\n" +
  " └╴node8 {n:9}\n" +
  "   └╴node7 {n:8}\n" +
  "     └╴node6 {n:7}\n" +
  "       └╴node5 {n:6}\n" +
  "         └╴node4 {n:5}\n" +
  "           └╴node3 {n:4}\n" +
  "             └╴node2 {n:3}\n" +
  "               └╴node1 {n:2}\n" +
  "                 └╴node0 {n:1}\n");
});

it('splays 0th', function() {
x.nth(0);
assert.equal(x.toString(),
  "   ┌╴node9 {n:1}\n" +
  " ┌╴node8 {n:9}\n" +
  " │ │ ┌╴node7 {n:1}\n" +
  " │ └╴node6 {n:7}\n" +
  " │   │ ┌╴node5 {n:1}\n" +
  " │   └╴node4 {n:5}\n" +
  " │     │ ┌╴node3 {n:1}\n" +
  " │     └╴node2 {n:3}\n" +
  " │       └╴node1 {n:1}\n" +
  "━node0 {n:10}\n");
});

it('splays 1st', function() {
x.nth(1);
assert.equal(x.toString(),
  "     ┌╴node9 {n:1}\n" +
  "   ┌╴node8 {n:3}\n" +
  "   │ └╴node7 {n:1}\n" +
  " ┌╴node6 {n:8}\n" +
  " │ │   ┌╴node5 {n:1}\n" +
  " │ │ ┌╴node4 {n:3}\n" +
  " │ │ │ └╴node3 {n:1}\n" +
  " │ └╴node2 {n:4}\n" +
  "━node1 {n:10}\n" +
  " └╴node0 {n:1}\n");
});

it('splays 2nd', function() {
x.nth(2);
assert.equal(x.toString(),
  "     ┌╴node9 {n:1}\n" +
  "   ┌╴node8 {n:3}\n" +
  "   │ └╴node7 {n:1}\n" +
  " ┌╴node6 {n:7}\n" +
  " │ │ ┌╴node5 {n:1}\n" +
  " │ └╴node4 {n:3}\n" +
  " │   └╴node3 {n:1}\n" +
  "━node2 {n:10}\n" +
  " └╴node1 {n:2}\n" +
  "   └╴node0 {n:1}\n");
});

it('splays 3rd', function() {
x.nth(3);
assert.equal(x.toString(),
  "       ┌╴node9 {n:1}\n" +
  "     ┌╴node8 {n:3}\n" +
  "     │ └╴node7 {n:1}\n" +
  "   ┌╴node6 {n:5}\n" +
  "   │ └╴node5 {n:1}\n" +
  " ┌╴node4 {n:6}\n" +
  "━node3 {n:10}\n" +
  " └╴node2 {n:3}\n" +
  "   └╴node1 {n:2}\n" +
  "     └╴node0 {n:1}\n");
});

it('splays 4th', function() {
x.nth(4);
assert.equal(x.toString(),
  "     ┌╴node9 {n:1}\n" +
  "   ┌╴node8 {n:3}\n" +
  "   │ └╴node7 {n:1}\n" +
  " ┌╴node6 {n:5}\n" +
  " │ └╴node5 {n:1}\n" +
  "━node4 {n:10}\n" +
  " └╴node3 {n:4}\n" +
  "   └╴node2 {n:3}\n" +
  "     └╴node1 {n:2}\n" +
  "       └╴node0 {n:1}\n");
});

it('splays 5th', function() {
x.nth(5);
assert.equal(x.toString(),
  "     ┌╴node9 {n:1}\n" +
  "   ┌╴node8 {n:3}\n" +
  "   │ └╴node7 {n:1}\n" +
  " ┌╴node6 {n:4}\n" +
  "━node5 {n:10}\n" +
  " └╴node4 {n:5}\n" +
  "   └╴node3 {n:4}\n" +
  "     └╴node2 {n:3}\n" +
  "       └╴node1 {n:2}\n" +
  "         └╴node0 {n:1}\n");
});

it('splays 6th', function() {
x.nth(6);
assert.equal(x.toString(),
  "   ┌╴node9 {n:1}\n" +
  " ┌╴node8 {n:3}\n" +
  " │ └╴node7 {n:1}\n" +
  "━node6 {n:10}\n" +
  " └╴node5 {n:6}\n" +
  "   └╴node4 {n:5}\n" +
  "     └╴node3 {n:4}\n" +
  "       └╴node2 {n:3}\n" +
  "         └╴node1 {n:2}\n" +
  "           └╴node0 {n:1}\n");
});

it('splays 7th', function() {
x.nth(7);
assert.equal(x.toString(),
  "   ┌╴node9 {n:1}\n" +
  " ┌╴node8 {n:2}\n" +
  "━node7 {n:10}\n" +
  " └╴node6 {n:7}\n" +
  "   └╴node5 {n:6}\n" +
  "     └╴node4 {n:5}\n" +
  "       └╴node3 {n:4}\n" +
  "         └╴node2 {n:3}\n" +
  "           └╴node1 {n:2}\n" +
  "             └╴node0 {n:1}\n");
});

it('splays 8th', function() {
x.nth(8);
assert.equal(x.toString(),
  " ┌╴node9 {n:1}\n" +
  "━node8 {n:10}\n" +
  " └╴node7 {n:8}\n" +
  "   └╴node6 {n:7}\n" +
  "     └╴node5 {n:6}\n" +
  "       └╴node4 {n:5}\n" +
  "         └╴node3 {n:4}\n" +
  "           └╴node2 {n:3}\n" +
  "             └╴node1 {n:2}\n" +
  "               └╴node0 {n:1}\n");
});

it('splays 9th', function() {
x.nth(9);
assert.equal(x.toString(),
  "━node9 {n:10}\n" +
  " └╴node8 {n:9}\n" +
  "   └╴node7 {n:8}\n" +
  "     └╴node6 {n:7}\n" +
  "       └╴node5 {n:6}\n" +
  "         └╴node4 {n:5}\n" +
  "           └╴node3 {n:4}\n" +
  "             └╴node2 {n:3}\n" +
  "               └╴node1 {n:2}\n" +
  "                 └╴node0 {n:1}\n");
});

});

