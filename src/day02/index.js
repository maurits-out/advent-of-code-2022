import run from "aocrunner";

const totalScore = (rawInput, scoreTable) => rawInput.split("\n").map(round => scoreTable[round]).reduce((acc, n) => acc + n);

const part1 = (rawInput) => {
  const scoreTable = {
    "A X": 4,
    "A Y": 8,
    "A Z": 3,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 7,
    "C Y": 2,
    "C Z": 6
  };
  return totalScore(rawInput, scoreTable);
};

const part2 = (rawInput) => {
  const scoreTable = {
    "A X": 3,
    "A Y": 4,
    "A Z": 8,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 2,
    "C Y": 6,
    "C Z": 7
  };
  return totalScore(rawInput, scoreTable);
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
