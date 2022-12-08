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
    tests: [
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 5
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 6
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 10
      },
      {
        input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
        expected: 11
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
        expected: 19
      },
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 23
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 23
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 29
      },
      {
        input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
        expected: 26
      }      
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
