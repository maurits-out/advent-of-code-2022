import run from "aocrunner";

const lowerCasePriorityBase = 1 - "a".charCodeAt(0);
const upperCasePriorityBase = 27 - "A".charCodeAt(0);

function parseInput(rawInput) {
  return rawInput.split("\n");
}

function priority(item) {
  if (item === item.toUpperCase()) {
    return upperCasePriorityBase + item.charCodeAt(0);
  }
  return lowerCasePriorityBase + item.charCodeAt(0);
}

function commonItemTypeInRucksack(rucksack) {
  const split = rucksack.length / 2;
  const compartment1 = rucksack.substring(0, split);
  const compartment2 = rucksack.substring(split);
  return [...compartment1].find((itemType) => compartment2.includes(itemType));
}

function commonItemTypeInRucksacks(rucksack1, rucksack2, rucksack3) {
  return [...rucksack1].find(
    (itemType) => rucksack2.includes(itemType) && rucksack3.includes(itemType),
  );
}

const part1 = (rawInput) =>
  parseInput(rawInput)
    .map((rucksack) => commonItemTypeInRucksack(rucksack))
    .map((itemType) => priority(itemType))
    .reduce((acc, priority) => acc + priority, 0);

const part2 = (rawInput) => {
  const rucksacks = parseInput(rawInput);
  let sum = 0;
  for (let groupIndex = 0; groupIndex < rucksacks.length; groupIndex += 3) {
    let group = rucksacks.slice(groupIndex, groupIndex + 3);
    sum += priority(commonItemTypeInRucksacks(...group));
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
      `,
        expected: 157
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
      `,
        expected: 70
      }
    ],
    solution: part2
  },
  trimTestInputs: true,
  onlyTests: false
});
