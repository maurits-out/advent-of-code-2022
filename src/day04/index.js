import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput
    .split("\n")
    .map((line) => line.match(/\d+/g))
    .map((ss) => ss.map((s) => +s));

const solve = (rawInput, predicate) =>
  parseInput(rawInput).filter(predicate).length;

const part1 = (rawInput) =>
  solve(rawInput, ([a, b, c, d]) => (a <= c && d <= b) || (c <= a && b <= d));

const part2 = (rawInput) =>
  solve(rawInput, ([a, b, c, d]) => !(b < c || d < a));

run({
  part1: {
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
