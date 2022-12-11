import run from "aocrunner";

function createOperator(line) {
  const [operator, operand] = line.split(" ").slice(-2);
  if (operand === "old") {
    if (operator === "+") {
      return (worryLevel) => worryLevel + worryLevel;
    }
    return (worryLevel) => worryLevel * worryLevel;
  }
  const operandValue = Number(operand);
  if (operator === "+") {
    return (worryLevel) => worryLevel + operandValue;
  }
  return (worryLevel) => worryLevel * operandValue;
}

function parseMonkey(section) {
  const lines = section.split("\n");
  return {
    items: lines[1].match(/\d+/g).map((str) => Number(str)),
    operator: createOperator(lines[2]),
    divider: Number(lines[3].split(" ").at(-1)),
    targetMonkey: new Map([
      [false, Number(lines[5].split(" ").at(-1))],
      [true, Number(lines[4].split(" ").at(-1))],
    ]),
    inspectionCount: 0,
  };
}

function parseInput(rawInput) {
  return rawInput.split("\n\n").map((section) => parseMonkey(section));
}

function play(monkeys, roundCount, worryReliever) {
  for (let round = 0; round < roundCount; round++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length > 0) {
        let worryLevel = monkey.items.shift();
        worryLevel = monkey.operator(worryLevel);
        worryLevel = worryReliever(worryLevel);
        const divisible = worryLevel % monkey.divider == 0;
        const targetMonkey = monkey.targetMonkey.get(divisible);
        monkeys[targetMonkey].items.push(worryLevel);
        monkey.inspectionCount++;
      }
    });
  }
}

function calculateMonkeyBusiness(monkeys) {
  const [count1, count2] = monkeys
    .map((monkey) => monkey.inspectionCount)
    .sort((a, b) => b - a);
  return count1 * count2;
}

function part1(rawInput) {
  const monkeys = parseInput(rawInput);
  play(monkeys, 20, (worryLevel) => Math.floor(worryLevel / 3));
  return calculateMonkeyBusiness(monkeys);
}

function part2(rawInput) {
  const monkeys = parseInput(rawInput);
  const lcm = monkeys.reduce((acc, monkey) => acc * monkey.divider, 1);
  play(monkeys, 10000, (worryLevel) => worryLevel % lcm);
  return calculateMonkeyBusiness(monkeys);
}

run({
  part1: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
      `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
      `,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
