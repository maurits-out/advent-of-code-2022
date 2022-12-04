import run from "aocrunner";

const parseInput = (rawInput) => 
  rawInput.split("\n").map(line => line.match(/\d+/g)).map(pairs => pairs.map(s => +s));

const part1 = (rawInput) =>
  parseInput(rawInput).filter(([a, b, c, d]) => (a <= c && d <= b) || (c <= a && b <= d)).length;

const part2 = (rawInput) => 
  parseInput(rawInput).filter(([a, b, c, d]) => !(b < c || d < a)).length;

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
