import run from "aocrunner";

const calculateSum = (array) => array.reduce((acc, n) => acc + n, 0);

const parseSection = (section) => section.split("\n").map((num) => parseInt(num));

const parseInput = (rawInput) => rawInput.split("\n\n").map(parseSection).map(calculateSum);

const part1 = (rawInput) => {
  const calorieSummations = parseInput(rawInput);
  return Math.max(...calorieSummations);
};

const part2 = (rawInput) => {
  const calorieSummations = parseInput(rawInput);
  return calculateSum(calorieSummations.sort().slice(-3));
};

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
