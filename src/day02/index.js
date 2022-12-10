import run from "aocrunner";

function totalScore(rawInput, scoreTable) {
  return rawInput
    .split("\n")
    .reduce((acc, round) => acc + scoreTable[round], 0);
}

function part1(rawInput) {
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

function part2(rawInput) {
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
    tests: [
      {
        input: `
        A Y
        B X
        C Z
      `,
        expected: 15
      },
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
      `,
        expected: 12
      },
    ],
    solution: part2
  },
  trimTestInputs: true,
  onlyTests: false,
});
