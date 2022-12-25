import run from "aocrunner";

const SnafuDigitToDecimal = new Map([
  ["2", 2],
  ["1", 1],
  ["0", 0],
  ["-", -1],
  ["=", -2]
]);

const DecimalDigitToSnafuDigit = new Map([
  [0, "0"],
  [1, "1"],
  [2, "2"],
  [3, "="],
  [4, "-"]
]);

function parseInput(rawInput) {
  return rawInput.split("\n");
}

function toDecimal(snafu) {
  return snafu
    .split("")
    .map((s) => SnafuDigitToDecimal.get(s))
    .reduce((acc, n, i) => acc + Math.pow(5, snafu.length - i - 1) * n, 0);
}

function toSnafu(decimal) {
  const result = [];
  let remaining = decimal;
  while (remaining !== 0) {
    result.push(DecimalDigitToSnafuDigit.get(remaining % 5));
    remaining = Math.floor((remaining + 2) / 5);
  }
  return result.reverse().join("");
}

function part1(rawInput) {
  const sum = parseInput(rawInput)
    .map((snafu) => toDecimal(snafu))
    .reduce((acc, n) => acc + n, 0);
  return toSnafu(sum);
}

function part2(rawInput) {}

run({
  part1: {
    tests: [
      {
        input: `
        1=-0-2
        12111
        2=0=
        21
        2=01
        111
        20012
        112
        1=-1=
        1-12
        12
        1=
        122`,
        expected: "2=-1=0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
