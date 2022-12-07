import run from "aocrunner";

const findMarker = (input, numDistinctCharacters) => {
  for (let i = numDistinctCharacters; i <= input.length; i++) {
    let packet = input.slice(i - numDistinctCharacters, i);
    let received = new Set(packet);
    if (received.size == numDistinctCharacters) {
      return i;
    }
  }
};

const part1 = (input) => findMarker(input, 4);

const part2 = (input) => findMarker(input, 14);

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
