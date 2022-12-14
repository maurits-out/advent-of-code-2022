import run from "aocrunner";

function createNode() {
  return { dirs: new Map(), fileSize: 0 };
}

function parseInput(rawInput) {
  const root = createNode();
  const directories = [root];

  let current = null;
  for (const line of rawInput.split("\n")) {
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
        current.fileSize += Number(cmd[0]);
    }
  }
  return directories;
}

function getTotalFileSize(node) {
  return Array.from(node.dirs)
    .filter(([name, _]) => name != "..")
    .map(([_, child]) => getTotalFileSize(child))
    .reduce((acc, size) => acc + size, node.fileSize);
}

function part1(rawInput) {
  return parseInput(rawInput)
    .map((node) => getTotalFileSize(node))
    .filter((size) => size <= 100_000)
    .reduce((acc, size) => acc + size, 0);
}

function part2(rawInput) {
  let directories = parseInput(rawInput);
  let available = 70_000_000 - getTotalFileSize(directories[0]);
  let matchingTotalFileSizes = directories
    .map((node) => getTotalFileSize(node))
    .filter((size) => available + size >= 30_000_000);
  return Math.min(...matchingTotalFileSizes);
}

run({
  part1: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k
      `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k
      `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
