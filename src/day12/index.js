import run from "aocrunner";

function parseInput(rawInput) {
  const heightMap = rawInput.split("\n").map((line) => line.split(""));
  const rowCount = heightMap.length;
  const columnCount = heightMap[0].length;
  let start;
  let end;
  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columnCount; column++) {
      if (heightMap[row][column] == "S") {
        start = [row, column];
        heightMap[row][column] = "a";
      } else if (heightMap[row][column] == "E") {
        end = [row, column];
        heightMap[row][column] = "z";
      }
    }
  }
  return { heightMap, rowCount, columnCount, start, end };
}

function getAdjacentLocations([row, column]) {
  return [
    [row - 1, column],
    [row, column - 1],
    [row, column + 1],
    [row + 1, column],
  ];
}

function isOnMap([row, column], rowCount, columnCount) {
  return row >= 0 && row < rowCount && column >= 0 && column < columnCount;
}

function isOneHigher([fromRow, fromColumn], [toRow, toColumn], heightMap) {
  let elevationFrom = heightMap[fromRow][fromColumn].charCodeAt(0);
  let elevationTo = heightMap[toRow][toColumn].charCodeAt(0);
  return elevationTo - elevationFrom <= 1;
}

function findShortestPath(input, start) {
  const queue = [[start, 0]];
  const visited = new Set();
  visited.add(start.toString());
  let result = Infinity;
  while (queue.length > 0) {
    const [current, steps] = queue.shift();
    if (current.toString() === input.end.toString()) {
      result = steps;
      break;
    }
    getAdjacentLocations(current)
      .filter((location) =>
        isOnMap(location, input.rowCount, input.columnCount),
      )
      .filter((location) => !visited.has(location.toString()))
      .filter((location) => isOneHigher(current, location, input.heightMap))
      .forEach((location) => {
        queue.push([location, steps + 1]);
        visited.add(location.toString());
      });
  }
  return result;
}

function part1(rawInput) {
  const input = parseInput(rawInput);
  return findShortestPath(input, input.start);
}

function part2(rawInput) {
  const input = parseInput(rawInput);
  const distances = [];
  for (let row = 0; row < input.rowCount; row++) {
    for (let column = 0; column < input.columnCount; column++) {
      if (input.heightMap[row][column] == "a") {
        distances.push(findShortestPath(input, [row, column]));
      }
    }
  }
  return Math.min(...distances);
}

run({
  part1: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
      `,
        expected: 31,
      },
    ],
    solution: part1
  },
  part2: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
      `,
        expected: 29,
      },
    ],
    solution: part2
  },
  trimTestInputs: true,
  onlyTests: false
});
