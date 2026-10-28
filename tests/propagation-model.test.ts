import test from "node:test";
import assert from "node:assert/strict";
import { propagationDistances } from "../src/lib/propagation-model";
const edges = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];
test("broadcast reaches all nodes when the illustrated network is available", () => {
  assert.deepEqual(propagationDistances(6, edges, []), [0, 1, 1, 2, 2, 3]);
});
test("an offline node is excluded and reachable peers use another path", () => {
  assert.deepEqual(propagationDistances(6, edges, [1]), [
    0,
    Infinity,
    1,
    3,
    2,
    3,
  ]);
});
test("an offline origin cannot broadcast and disconnected nodes remain unreachable", () => {
  assert.ok(propagationDistances(6, edges, [0]).every((n) => n === Infinity));
  assert.deepEqual(propagationDistances(6, edges, [3, 4]), [
    0,
    1,
    1,
    Infinity,
    Infinity,
    Infinity,
  ]);
});
