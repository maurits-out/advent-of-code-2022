import run from "aocrunner";

function parseInput(rawInput) {
  return rawInput
    .split("\n")
    .map((line) => [line[0], Number(line.substring(2))]);
}

function moveHead([row, column], direction) {
  switch (direction) {
    case "L":
      return [row, column - 1];
    case "R":
      return [row, column + 1];
    case "U":
      return [row + 1, column];
    case "D":
      return [row - 1, column];
  }
}

function moveFollower([tr, tc], [hr, hc]) {
  const dc = hc - tc;
  const dr = hr - tr;
  if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) {
    return [tr, tc];
  }
  return [tr + Math.sign(dr), tc + Math.sign(dc)];
}

function applyMotions(motions, knotCount) {
  const knots = new Array(knotCount).fill().map(() => [0, 0]);
  const visited = new Set();
  visited.add(knots.at(-1).toString());
  motions.forEach(([direction, stepCount]) => {
    for (let step = 0; step < stepCount; step++) {
      knots[0] = moveHead(knots[0], direction);
      for (let i = 1; i < knots.length; i++) {
        knots[i] = moveFollower(knots[i], knots[i - 1]);
      }
      visited.add(knots.at(-1).toString());
    }
  });
  return visited.size;
}

function part1(rawInput) {
  return applyMotions(parseInput(rawInput), 2);
}

function part2(rawInput) {
  return applyMotions(parseInput(rawInput), 10);
}

run({
  part1: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
      `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
      `,
        expected: 1,
      },
      {
        input: `
        R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20
      `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
