import run from "aocrunner";

function findMarker(input, numDistinctCharacters) {
  for (let marker = numDistinctCharacters; marker <= input.length; marker++) {
    let packet = input.slice(marker - numDistinctCharacters, marker);
    let received = new Set(packet);
    if (received.size == numDistinctCharacters) {
      return marker;
    }
  }
}

function part1(input) {
  return findMarker(input, 4);
}

function part2(input) {
  return findMarker(input, 14);
}

run({
  part1: {
    tests: [
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 5,
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 6,
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 10,
      },
      {
        input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
        expected: 19,
      },
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 23,
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 23,
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 29,
      },
      {
        input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
