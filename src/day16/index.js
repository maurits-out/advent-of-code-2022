import run from "aocrunner";

function parseLine(line) {
  const re =
    /^Valve (.+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/;
  const [_, v, r, n] = line.match(re);
  return { name: v, rate: Number(r), neighbors: n.split(", ") };
}

function parseInput(rawInput) {
  return rawInput.split("\n").map(parseLine);
}

function shortestDistance(from, to, valves) {
  const queue = [[from, 0]];
  const visited = new Set([from]);
  while (queue.length) {
    const [valve, distance] = queue.shift();
    if (valve === to) {
      return distance;
    }
    valves[valve].neighbors
      .map((n) => valves.findIndex((v) => v.name === n))
      .filter((v) => !visited.has(v))
      .forEach((v) => {
        visited.add(v);
        queue.push([v, distance + 1]);
      });
  }
}

function createShortestDistanceMatrix(valves) {
  const matrix = new Array(valves.length);
  for (let i = 0; i < valves.length; i++) {
    matrix[i] = new Array(valves.length);
  }
  for (let i = 0; i < valves.length; i++) {
    matrix[i][i] = 0;
    for (let j = i + 1; j < valves.length; j++) {
      matrix[i][j] = matrix[j][i] = shortestDistance(i, j, valves);
    }
  }
  return matrix;
}

function toKey(opened) {
  return Array.from(opened).sort().join(", ");
}

function findMaximumPressureToRelease(valves, timeLimit) {
  const distanceMatrix = createShortestDistanceMatrix(valves);
  let maxima = new Map();

  function visit(valve, pressure, opened, remaining) {
    let key = toKey(opened);
    if (!maxima.has(key) || pressure > maxima.get(key).pressure) {
      maxima.set(key, { pressure, opened });
    }
    
    [...valves.keys()]
      .filter((v) => valves[v].rate > 0 && !opened.has(v))
      .forEach((v) => {
        const distance = distanceMatrix[valve][v];
        const newRemaining = remaining - distance - 1;
        if (newRemaining >= 0) {
          const newPressure = pressure + newRemaining * valves[v].rate;
          const newOpened = new Set(Array.from(opened)).add(v);
          visit(v, newPressure, newOpened, newRemaining);
        }
      });
  }

  const start = valves.findIndex((v) => v.name === "AA");
  visit(start, 0, new Set(), timeLimit);
  return Array.from(maxima.values());
}

function isDisjoint(opened1, opened2) {
  return Array.from(opened1).every((e) => !opened2.has(e));
}

function part1(rawInput) {
  const valves = parseInput(rawInput);
  const maxima = findMaximumPressureToRelease(valves, 30).map((s) => s.pressure);
  return Math.max(...maxima);
}

function part2(rawInput) {
  const valves = parseInput(rawInput);
  const maxima = findMaximumPressureToRelease(valves, 26);

  let max = -Infinity;
  for (let i = 0; i < maxima.length; i++) {
    for (let j = i + 1; j < maxima.length - 1; j++) {
      if (isDisjoint(maxima[i].opened, maxima[j].opened)) {
        max = Math.max(max, maxima[i].pressure + maxima[j].pressure);
      }
    }
  }

  return max;
}

run({
  part1: {
    tests: [
      {
        input: `
        Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        Valve BB has flow rate=13; tunnels lead to valves CC, AA
        Valve CC has flow rate=2; tunnels lead to valves DD, BB
        Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
        Valve EE has flow rate=3; tunnels lead to valves FF, DD
        Valve FF has flow rate=0; tunnels lead to valves EE, GG
        Valve GG has flow rate=0; tunnels lead to valves FF, HH
        Valve HH has flow rate=22; tunnel leads to valve GG
        Valve II has flow rate=0; tunnels lead to valves AA, JJ
        Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
          Valve BB has flow rate=13; tunnels lead to valves CC, AA
          Valve CC has flow rate=2; tunnels lead to valves DD, BB
          Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
          Valve EE has flow rate=3; tunnels lead to valves FF, DD
          Valve FF has flow rate=0; tunnels lead to valves EE, GG
          Valve GG has flow rate=0; tunnels lead to valves FF, HH
          Valve HH has flow rate=22; tunnel leads to valve GG
          Valve II has flow rate=0; tunnels lead to valves AA, JJ
          Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
