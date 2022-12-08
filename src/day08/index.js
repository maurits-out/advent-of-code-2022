import run from "aocrunner";

const range = (n) => [...Array(n).keys()];

const coordinates = (heightMap) =>
  range(heightMap.length).flatMap((r) =>
    range(heightMap[r].length).map((c) => [r, c]),
  );

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split("").map((ch) => +ch));

const isVisible = (heightMap, row, column) => {
  let left = Math.max(...heightMap[row].slice(0, column));
  let right = Math.max(...heightMap[row].slice(column + 1));
  let up = Math.max(...heightMap.slice(0, row).map((r) => r[column]));
  let down = Math.max(...heightMap.slice(row + 1).map((r) => r[column]));
  let height = heightMap[row][column];
  return height > left || height > right || height > up || height > down;
};

const distance = (height, trees) => {
  let d = range(trees.length).filter((t) => trees[t] >= height);
  return d.length > 0 ? d[0] + 1 : trees.length;
}

const scenicScore = (heightMap, row, column) => {
  let left = heightMap[row].slice(0, column).reverse();
  let right = heightMap[row].slice(column + 1);
  let up = heightMap.slice(0, row).map((r) => r[column]).reverse();
  let down = heightMap.slice(row + 1).map((r) => r[column]);
  let height = heightMap[row][column];
  return distance(height, left) * distance(height, right) * distance(height, up) * distance(height, down)
};

const part1 = (rawInput) => {
  let heightMap = parseInput(rawInput);
  return coordinates(heightMap).filter(([r, c]) => isVisible(heightMap, r, c)).length;
};

const part2 = (rawInput) => {
  let heightMap = parseInput(rawInput);
  let scores = coordinates(heightMap).map(([r, c]) =>
    scenicScore(heightMap, r, c),
  );
  return Math.max(...scores);
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
