import run from "aocrunner";

function parsePairString(pairString) {
  return pairString.split("\n").map(JSON.parse);
}

function parseInput(rawInput) {
  return rawInput.split("\n\n").map(parsePairString);
}

function compare(packet1, packet2) {
  if (Number.isInteger(packet1) && Number.isInteger(packet2)) {
    return packet1 - packet2;
  }
  if (Number.isInteger(packet1)) {
    return compare([packet1], packet2);
  }
  if (Number.isInteger(packet2)) {
    return compare(packet1, [packet2]);
  }
  const length = Math.min(packet1.length, packet2.length);
  let c;
  for (let i = 0; i < length && !c; i++) {
    c = compare(packet1[i], packet2[i]);
  }
  return c || packet1.length - packet2.length;
}

function part1(rawInput) {
  const pairs = parseInput(rawInput);
  return [...pairs.keys()]
    .filter((i) => compare(pairs[i][0], pairs[i][1]) < 0)
    .reduce((acc, i) => acc + i + 1, 0);
}

function part2(rawInput) {
  const dividerPackets = ["[[2]]", "[[6]]"].map(JSON.parse);
  const packets = parseInput(rawInput)
    .flatMap((pair) => pair)
    .concat(dividerPackets)
    .sort((a, b) => compare(a, b));
  const [i, j] = dividerPackets.map((packet) => packets.indexOf(packet) + 1);
  return i * j;
};

run({
  part1: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
        [1,1,5,1,1]
        
        [[1],[2,3,4]]
        [[1],4]
        
        [9]
        [[8,7,6]]
        
        [[4,4],4,4]
        [[4,4],4,4,4]
        
        [7,7,7,7]
        [7,7,7]
        
        []
        [3]
        
        [[[]]]
        [[]]
        
        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]
      `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
        [1,1,5,1,1]
        
        [[1],[2,3,4]]
        [[1],4]
        
        [9]
        [[8,7,6]]
        
        [[4,4],4,4]
        [[4,4],4,4,4]
        
        [7,7,7,7]
        [7,7,7]
        
        []
        [3]
        
        [[[]]]
        [[]]
        
        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]
      `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
