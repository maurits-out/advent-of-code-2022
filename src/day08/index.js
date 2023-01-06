import run from "aocrunner";

function range(n) {
  return [...Array(n).keys()];
}

function coordinates(heightMap) {
  return range(heightMap.length).flatMap((r) =>
    range(heightMap[r].length).map((c) => [r, c]),
  );
}

function parseInput(rawInput) {
  return rawInput
    .split("\n")
    .map((line) => line.split("").map((ch) => Number(ch)));
}

function isVisible(heightMap, row, column) {
  const left = Math.max(...heightMap[row].slice(0, column));
  const right = Math.max(...heightMap[row].slice(column + 1));
  const up = Math.max(...heightMap.slice(0, row).map((r) => r[column]));
  const down = Math.max(...heightMap.slice(row + 1).map((r) => r[column]));
  const height = heightMap[row][column];
  return height > left || height > right || height > up || height > down;
}

function distance(height, trees) {
  const d = range(trees.length).filter((t) => trees[t] >= height);
  return d.length > 0 ? d[0] + 1 : trees.length;
}

function scenicScore(heightMap, row, column) {
  const left = heightMap[row].slice(0, column).reverse();
  const right = heightMap[row].slice(column + 1);
  const up = heightMap
    .slice(0, row)
    .map((r) => r[column])
    .reverse();
  const down = heightMap.slice(row + 1).map((r) => r[column]);
  const height = heightMap[row][column];
  return (
    distance(height, left) *
    distance(height, right) *
    distance(height, up) *
    distance(height, down)
  );
}

function part1(rawInput) {
  const heightMap = parseInput(rawInput);
  return coordinates(heightMap).filter(([r, c]) => isVisible(heightMap, r, c))
    .length;
}

function part2(rawInput) {
  const heightMap = parseInput(rawInput);
  const scores = coordinates(heightMap).map(([r, c]) =>
    scenicScore(heightMap, r, c),
  );
  return Math.max(...scores);
}

run({
  part1: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
      `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
      `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
