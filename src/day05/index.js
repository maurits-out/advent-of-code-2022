import run from "aocrunner";

function parseInstructions(section) {
  return section
    .split("\n")
    .map((line) => line.match(/\d+/g))
    .map((values) => values.map(Number));
}

function parseCrates(section) {
  let crates = section.split("\n");
  let stackCount = crates.at(-1).match(/\d+/g).length;
  let stacks = [];
  for (let s = 0; s <= stackCount; s++) {
    stacks.push([]);
  }
  for (const row of crates.reverse().slice(1)) {
    for (let i = 0; i < stackCount; i++) {
      const start = 4 * i + 1;
      const ch = row.substring(start, start + 1);
      if (ch.match(/[A-Z]/i)) {
        stacks[i + 1].push(ch);
      }
    }
  }
  return stacks;
}

function parseInput(rawInput) {
  let sections = rawInput.split("\n\n");
  let stacks = parseCrates(sections[0]);
  let instructions = parseInstructions(sections[1]);
  return { stacks, instructions };
}

function moveInReverseOrder(stacks, count, from, to) {
  for (let c = 0; c < count; c++) {
    let crate = stacks[from].pop();
    stacks[to].push(crate);
  }
}

function moveInIdenticalOrder(stacks, count, from, to) {
  moveInReverseOrder(stacks, count, from, 0);
  moveInReverseOrder(stacks, count, 0, to);
}

function applyInstructions(stacks, instructions, moveFn) {
  for (const [count, from, to] of instructions) {
    moveFn(stacks, count, from, to);
  }
}

function getTopLevelCrates(stacks) {
  return stacks
    .slice(1)
    .map((s) => s.at(-1))
    .join("");
}

function part1(rawInput) {
  const { stacks, instructions } = parseInput(rawInput);
  applyInstructions(stacks, instructions, moveInReverseOrder);
  return getTopLevelCrates(stacks);
}

function part2(rawInput) {
  const { stacks, instructions } = parseInput(rawInput);
  applyInstructions(stacks, instructions, moveInIdenticalOrder);
  return getTopLevelCrates(stacks);
}

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
