import run from "aocrunner";

function priority(item) {
  if (item == item.toUpperCase()) {
    return item.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  }
  return item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

function commonItemTypeInRucksack(rucksack) {
  const half = rucksack.length / 2;
  const compartment1 = rucksack.substring(0, half);
  const compartment2 = rucksack.substring(half);
  return [...compartment1].find(itemType => compartment2.includes(itemType));
}

function commonItemTypeInRucksacks(rucksack1, rucksack2, rucksack3) {
  return [...rucksack1].find(itemType => rucksack2.includes(itemType) && rucksack3.includes(itemType));
}

const part1 = (rawInput) => 
  rawInput
    .split("\n")
    .reduce((acc, rucksack) => acc + priority(commonItemTypeInRucksack(rucksack)), 0);


const part2 = (rawInput) => {
  const rucksacks = rawInput.split("\n");
  let sum = 0;
  for (let groupIndex = 0; groupIndex < rucksacks.length; groupIndex += 3) {
    let group = rucksacks.slice(groupIndex, groupIndex + 3)
    sum += priority(commonItemTypeInRucksacks(...group));
  }
  return sum;
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
