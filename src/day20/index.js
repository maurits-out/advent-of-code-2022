import run from "aocrunner";

class MixingEntry {
  constructor(val, srcIdx) {
    this.val = val;
    this.srcIdx = srcIdx;
  }
}

function parseInput(rawInput) {
  return rawInput.split("\n").map(Number);
}

function mix(payload, mixingEntries) {
  for (let srcIdx = 0; srcIdx < payload.length; srcIdx++) {
    const val = payload[srcIdx];
    if (val === 0) {
      continue;
    }
    const mixingIdx = mixingEntries.findIndex((me) => me.srcIdx === srcIdx);
    const deleted = mixingEntries.splice(mixingIdx, 1);
    const targetIdx = (val + mixingIdx) % (payload.length - 1);
    if (targetIdx === 0) {
      mixingEntries.push(...deleted);
    } else {
      mixingEntries.splice(targetIdx, 0, ...deleted);
    }
  }
}

function decrypt(payload, iterations) {
  const mixingEntries = payload.map((val, idx) => new MixingEntry(val, idx));
  for (let i = 0; i < iterations; i++) {
    mix(payload, mixingEntries);
  }
  return mixingEntries.map((me) => me.val);
}

function groveCoordinates(decrypted) {
  const idx = decrypted.findIndex((val) => val === 0);
  const groveNumbers = [1000, 2000, 3000];
  return groveNumbers.map((val) => decrypted[(idx + val) % decrypted.length]);
}

function sumOfGroveCoordinates(decrypted) {
  return groveCoordinates(decrypted).reduce((acc, n) => acc + n, 0);
}

function part1(rawInput) {
  const payload = parseInput(rawInput);
  const decrypted = decrypt(payload, 1);
  return sumOfGroveCoordinates(decrypted);
}

function part2(rawInput) {
  const decryptionKey = 811589153;
  const payload = parseInput(rawInput).map((val) => val * decryptionKey);
  const decrypted = decrypt(payload, 10);
  return sumOfGroveCoordinates(decrypted);
}

run({
  part1: {
    tests: [
      {
        input: `
        1
        2
        -3
        3
        -2
        0
        4`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1
        2
        -3
        3
        -2
        0
        4`,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
