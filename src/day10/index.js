import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split(" "));

const runProgram = (program) => {
  const cycles = new Map();
  let x = 1;
  let currentCycle = 1;
  program.forEach((instruction) => {
    switch (instruction[0]) {
      case "addx":
        cycles.set(currentCycle, x);
        cycles.set(currentCycle + 1, x);
        currentCycle += 2;
        x += +instruction[1];
        break;
      case "noop":
        cycles.set(currentCycle, x);
        currentCycle++;
        break;
    }
  });
  return cycles;
};

const part1 = (rawInput) => {
  const program = parseInput(rawInput);
  const cycles = runProgram(program);
  return [20, 60, 100, 140, 180, 220].reduce(
    (acc, cycle) => acc + cycle * cycles.get(cycle),
    0,
  );
};

const part2 = (rawInput) => {
  const program = parseInput(rawInput);
  const cycles = runProgram(program);
  const crt = new Array(6);
  for (let row = 0; row < 6; row++) {
    crt[row] = new Array(40);
    for (let column = 0; column < 40; column++) {
      const cycle = row * 40 + column + 1;
      const sprite = cycles.get(cycle);
      if (sprite - 1 <= column && column <= sprite + 1) {
        crt[row][column] = "#";
      } else {
        crt[row][column] = ".";
      }
    }
  }
  return crt.map(row => row.join("")).join("\n");
};

run({
  part1: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop
      `,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
