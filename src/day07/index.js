import run from "aocrunner";

const createNode = () => {
  return { dirs: new Map(), fileSize: 0 };
};

const parseInput = (rawInput) => {
  let root = createNode();
  let directories = [root];
  let current = null;
  rawInput.split("\n").forEach((line) => {
    let cmd = line.split(" ");
    switch (cmd[0]) {
      case "$":
        if (cmd[1] == "cd") {
          if (cmd[2] == "/") {
            current = root;
          } else {
            current = current.dirs.get(cmd[2]);
          }
        }
        break;
      case "dir":
        let node = createNode();
        node.dirs.set("..", current);
        current.dirs.set(cmd[1], node);
        directories.push(node);
        break;
      default:
        current.fileSize += parseInt(cmd[0]);
    }
  });
  return directories;
};

const getTotalFileSize = (node) =>
  Array.from(node.dirs)
    .filter(([name, _]) => name != "..")
    .map(([_, child]) => child)
    .reduce((acc, child) => acc + getTotalFileSize(child), node.fileSize);

const part1 = (rawInput) =>
  parseInput(rawInput)
    .map((node) => getTotalFileSize(node))
    .filter((size) => size <= 100000)
    .reduce((acc, size) => acc + size, 0);

const part2 = (rawInput) => {
  let directories = parseInput(rawInput);
  let available = 70_000_000 - getTotalFileSize(directories[0]);
  let matchingTotalFileSizes = directories
    .map((node) => getTotalFileSize(node))
    .sort((a, b) => a - b)
    .filter((size) => available + size >= 30_000_000);
  return matchingTotalFileSizes[0];
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
