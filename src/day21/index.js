import run from "aocrunner";

class Jobs {
  #jobs;

  constructor(jobs) {
    this.#jobs = jobs;
  }

  static of(rawInput) {
    function parseLine(line) {
      const s = line.split(" ");
      return [s[0].substring(0, 4), s.slice(1)];
    }
    const jobsMap = new Map(rawInput.split("\n").map(parseLine));
    return new Jobs(jobsMap);
  }

  getNumber(name) {
    const instr = this.#jobs.get(name);
    if (instr.length === 1) {
      return Number(instr[0]);
    }
    const left = this.getNumber(instr[0]);
    const right = this.getNumber(instr[2]);
    switch (instr[1]) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
    }
  }

  containsHuman(name) {
    if (name === "humn") {
      return true;
    }
    const instr = this.#jobs.get(name);
    if (instr.length === 1) {
      return false;
    }
    return this.containsHuman(instr[0]) || this.containsHuman(instr[2]);
  }

  fixRootOperation() {
    this.#jobs.get("root")[1] = "=";
  }

  getValueOfHuman(name, expected) {
    const instr = this.#jobs.get(name);
    if (instr.length === 1) {
      return expected;
    }
    const left = instr[0];
    const right = instr[2];
    switch (instr[1]) {
      case "=":
        return this.#getValueOfHumanForEquals(left, right);
      case "+":
        return this.#getValueOfHumanForPlus(left, right, expected);
      case "-":
        return this.#getValueOfHumanForMinus(left, right, expected);
      case "*":
        return this.#getValueOfHumanForMultiply(left, right, expected);
      case "/":
        return this.#getValueOfHumanForfDivide(left, right, expected);
    }
  }

  #getValueOfHumanForEquals(left, right) {
    if (this.containsHuman(left)) {
      return this.getValueOfHuman(left, this.getNumber(right));
    }
    return this.getValueOfHuman(right, this.getNumber(left));
  }

  #getValueOfHumanForPlus(left, right, expected) {
    if (this.containsHuman(left)) {
      const newExpected = expected - this.getNumber(right);
      return this.getValueOfHuman(left, newExpected);
    }
    const newExpected = expected - this.getNumber(left);
    return this.getValueOfHuman(right, newExpected);
  }

  #getValueOfHumanForMinus(left, right, expected) {
    if (this.containsHuman(left)) {
      const newExpected = expected + this.getNumber(right);
      return this.getValueOfHuman(left, newExpected);
    }
    const newExpected = this.getNumber(left) - expected;
    return this.getValueOfHuman(right, newExpected);
  }

  #getValueOfHumanForMultiply(left, right, expected) {
    if (this.containsHuman(left)) {
      const newExpected = expected / this.getNumber(right);
      return this.getValueOfHuman(left, newExpected);
    }
    const newExpected = expected / this.getNumber(left);
    return this.getValueOfHuman(right, newExpected);
  }

  #getValueOfHumanForfDivide(left, right, expected) {
    if (this.containsHuman(left)) {
      const newExpected = expected * this.getNumber(right);
      return this.getValueOfHuman(left, newExpected);
    }
    const newExpected = this.getNumber(left) / expected;
    return this.getValueOfHuman(right, newExpected);
  }
}

function part1(rawInput) {
  const jobs = Jobs.of(rawInput);
  return jobs.getNumber("root");
}

function part2(rawInput) {
  const jobs = Jobs.of(rawInput);
  jobs.fixRootOperation();
  return jobs.getValueOfHuman("root");
}

run({
  part1: {
    tests: [
      {
        input: `
        root: pppw + sjmn
        dbpl: 5
        cczh: sllz + lgvd
        zczc: 2
        ptdq: humn - dvpt
        dvpt: 3
        lfqf: 4
        humn: 5
        ljgn: 2
        sjmn: drzm * dbpl
        sllz: 4
        pppw: cczh / lfqf
        lgvd: ljgn * ptdq
        drzm: hmdt - zczc
        hmdt: 32`,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        root: pppw + sjmn
        dbpl: 5
        cczh: sllz + lgvd
        zczc: 2
        ptdq: humn - dvpt
        dvpt: 3
        lfqf: 4
        humn: 5
        ljgn: 2
        sjmn: drzm * dbpl
        sllz: 4
        pppw: cczh / lfqf
        lgvd: ljgn * ptdq
        drzm: hmdt - zczc
        hmdt: 32`,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
