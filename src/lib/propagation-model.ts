export function propagationDistances(
  nodeCount: number,
  edges: readonly (readonly number[])[],
  offNodes: readonly number[],
  origin = 0,
) {
  const off = new Set(offNodes),
    distances = Array<number>(nodeCount).fill(Infinity);
  if (off.has(origin)) return distances;
  distances[origin] = 0;
  const queue = [origin];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    for (const [a, b] of edges) {
      const next = a === current ? b : b === current ? a : -1;
      if (next < 0 || off.has(next) || Number.isFinite(distances[next]))
        continue;
      distances[next] = distances[current] + 1;
      queue.push(next);
    }
  }
  return distances;
}
