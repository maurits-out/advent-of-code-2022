import run from "aocrunner";

function parseInput(rawInput) {
  return rawInput.split("\n").map((line) => line.split(" "));
}

function runProgram(program) {
  const cycles = new Map();
  let x = 1;
  let cycle = 1;
  program.forEach((instruction) => {
    switch (instruction[0]) {
      case "addx":
        cycles.set(cycle, x);
        cycles.set(cycle + 1, x);
        cycle += 2;
        x += Number(instruction[1]);
        break;
      case "noop":
        cycles.set(cycle, x);
        cycle++;
        break;
    }
  });
  return cycles;
}

function part1(rawInput) {
  const program = parseInput(rawInput);
  const cycles = runProgram(program);
  return [20, 60, 100, 140, 180, 220]
    .map((c) => c * cycles.get(c))
    .reduce((acc, n) => acc + n, 0);
}

function part2(rawInput) {
  const program = parseInput(rawInput);
  const cycles = runProgram(program);
  const crt = [];
  for (let r = 0; r < 6; r++) {
    const row = [];
    for (let c = 0; c < 40; c++) {
      const cycle = r * 40 + c + 1;
      const sprite = cycles.get(cycle);
      if (sprite - 1 <= c && c <= sprite + 1) {
        row.push("#");
      } else {
        row.push(".");
      }
    }
    crt.push(row);
  }
  return crt.map((row) => row.join("")).join("\n");
}

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
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
