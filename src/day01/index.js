import run from "aocrunner";

function sum(numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

function parseSection(section) {
  return section.split("\n").map((num) => Number(num));
}

function parseInput(rawInput) {
  return rawInput.split("\n\n").map(parseSection).map(sum);
}

function part1(rawInput) {
  const calorieSummations = parseInput(rawInput);
  return Math.max(...calorieSummations);
}

function part2(rawInput) {
  const calorieSummations = parseInput(rawInput);
  return sum(calorieSummations.sort((a, b) => a - b).slice(-3));
}

run({
  part1: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000
      `,
        expected: 24000
      }
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000
      `,
        expected: 45000
      }      
    ],
    solution: part2
  },
  trimTestInputs: true,
  onlyTests: false
});
