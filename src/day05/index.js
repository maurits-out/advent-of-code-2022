import run from "aocrunner";

const parseInput = (rawInput) => {
  let sections = rawInput.split("\n\n");
  let instructions = sections[1]
    .split("\n")
    .map((line) => line.match(/\d+/g))
    .map((values) => values.map((v) => +v));
  let stacks = [
    [],
    ["G", "D", "V", "Z", "J", "S", "B"],
    ["Z", "S", "M", "G", "V", "P"],
    ["C", "L", "B", "S", "W", "T", "Q", "F"],
    ["H", "J", "G", "W", "M", "R", "V", "Q"],
    ["C", "L", "S", "N", "F", "M", "D"],
    ["R", "G", "C", "D"],
    ["H", "G", "T", "R", "J", "D", "S", "Q"],
    ["P", "F", "V"],
    ["D", "R", "S", "T", "J"],
  ];
  return { stacks, instructions };
};

const moveInReverseOrder = (stacks, numCrates, from, to) => {
  for (let c = 0; c < numCrates; c++) {
    let crate = stacks[from].pop();
    stacks[to].push(crate);
  }
};

const moveInIdenticalOrder = (stacks, numCrates, from, to) => {
  moveInReverseOrder(stacks, numCrates, from, 0);
  moveInReverseOrder(stacks, numCrates, 0, to);
};

const applyInstructions = (stacks, instructions, moveFn) => {
  for (let i = 0; i < instructions.length; i++) {
    let [numCrates, from, to] = instructions[i];
    moveFn(stacks, numCrates, from, to);
  }
};

const getTopLevelCrates = (stacks) => {
  let answer = "";
  for (let i = 1; i < stacks.length; i++) {
    answer += stacks[i].at(-1);
  }
  return answer;
};

const part1 = (rawInput) => {
  const { stacks, instructions } = parseInput(rawInput);
  applyInstructions(stacks, instructions, moveInReverseOrder);
  return getTopLevelCrates(stacks);
};

const part2 = (rawInput) => {
  const { stacks, instructions } = parseInput(rawInput);
  applyInstructions(stacks, instructions, moveInIdenticalOrder);
  return getTopLevelCrates(stacks);
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
