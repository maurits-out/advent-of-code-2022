import run from "aocrunner";

function parseInput(rawInput) {
  return rawInput
    .split("\n")
    .map((line) => line.match(/\d+/g))
    .map((ss) => ss.map((s) => Number(s)));
}

function solve(rawInput, predicate) {
  return parseInput(rawInput).filter(predicate).length;
}

function part1(rawInput) {
  return solve(
    rawInput,
    ([a, b, c, d]) => (a <= c && d <= b) || (c <= a && b <= d),
  );
}

function part2(rawInput) {
  return solve(rawInput, ([a, b, c, d]) => !(b < c || d < a));
}

run({
  part1: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8
      `,
        expected: 2,
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8
      `,
        expected: 4,
      }
    ],
    solution: part2
  },
  trimTestInputs: true,
  onlyTests: false
});
