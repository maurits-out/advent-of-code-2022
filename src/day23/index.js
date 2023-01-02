import run from "aocrunner";

const North = "N";
const South = "S";
const West = "W";
const East = "E";

function key(row, column) {
  return `${row},${column}`;
}

function coordinates(key) {
  return key.split(",").map(Number);
}

function parseInput(rawInput) {
  const elves = new Set();
  rawInput.split("\n").forEach((line, r) => {
    line.split("").forEach((ch, c) => {
      if (ch === "#") {
        elves.add(key(r, c));
      }
    });
  });
  return elves;
}

function adjacentPositions(elf) {
  const [row, column] = coordinates(elf);
  const adjacent = [
    [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ];
  return new Set(adjacent.map((location) => key(...location)));
}

function intersection(set1, set2) {
  return new Set([...set1].filter((e) => set2.has(e)));
}

function hasAdjacentElf(elf, elves) {
  return intersection(adjacentPositions(elf), elves).size > 0;
}

function getParticipatingElves(elves) {
  return new Set([...elves].filter((elf) => hasAdjacentElf(elf, elves)));
}

function getAdjacentPositionsNorth(row, column) {
  return [
    [row - 1, column],
    [row - 1, column + 1],
    [row - 1, column - 1],
  ];
}

function getAdjacentPositionsSouth(row, column) {
  return [
    [row + 1, column],
    [row + 1, column + 1],
    [row + 1, column - 1],
  ];
}

function getAdjacentPositionsWest(row, column) {
  return [
    [row, column - 1],
    [row - 1, column - 1],
    [row + 1, column - 1],
  ];
}

function getAdjacentPositionsEast(row, column) {
  return [
    [row, column + 1],
    [row - 1, column + 1],
    [row + 1, column + 1],
  ];
}

function proposeStep(elf, elves, directions) {
  const [r, c] = coordinates(elf);
  for (const direction of directions) {
    let adjacent;
    let step;
    switch (direction) {
      case North:
        adjacent = getAdjacentPositionsNorth(r, c);
        step = [r - 1, c];
        break;
      case South:
        adjacent = getAdjacentPositionsSouth(r, c);
        step = [r + 1, c];
        break;
      case West:
        adjacent = getAdjacentPositionsWest(r, c);
        step = [r, c - 1];
        break;
      case East:
        adjacent = getAdjacentPositionsEast(r, c);
        step = [r, c + 1];
    }
    if (adjacent.filter((k) => elves.has(key(...k))).length === 0) {
      return key(...step);
    }
  }
}

function countEmptyTiles(elves) {
  const c = Array.from(elves).map(coordinates);
  const rowNumbers = c.map(([r, _]) => r);
  const columnNumbers = c.map(([_, c]) => c);
  const minRow = Math.min(...rowNumbers);
  const maxRow = Math.max(...rowNumbers);
  const minColumn = Math.min(...columnNumbers);
  const maxColumn = Math.max(...columnNumbers);
  const total = (maxRow - minRow + 1) * (maxColumn - minColumn + 1);
  return total - elves.size;
}

function proposeSteps(elves, directions) {
  const participating = getParticipatingElves(elves);
  const result = new Map();
  for (const elf of participating) {
    const tile = proposeStep(elf, elves, directions);
    if (tile) {
      result.set(elf, tile);
    }
  }
  return result;
}

function countByTile(proposedSteps) {
  const tileCount = new Map();
  for (const tile of proposedSteps.values()) {
    if (tileCount.has(tile)) {
      tileCount.set(tile, tileCount.get(tile) + 1);
    } else {
      tileCount.set(tile, 1);
    }
  }
  return tileCount;
}

function part1(rawInput) {
  const elves = parseInput(rawInput);
  const directions = [North, South, West, East];
  for (let round = 0; round < 10; round++) {
    const proposedSteps = proposeSteps(elves, directions);
    const tileCount = countByTile(proposedSteps);
    for (const [elf, tile] of proposedSteps.entries()) {
      if (tileCount.get(tile) === 1) {
        elves.delete(elf);
        elves.add(tile);
      }
    }
    directions.push(directions.shift());
  }
  return countEmptyTiles(elves);
}

function part2(rawInput) {
  const elves = parseInput(rawInput);
  const directions = [North, South, West, East];
  let rounds = 0;
  let hasMoved;
  do {
    const proposedSteps = proposeSteps(elves, directions);
    const tileCount = countByTile(proposedSteps);
    hasMoved = false;
    for (const [elf, tile] of proposedSteps.entries()) {
      if (tileCount.get(tile) === 1) {
        elves.delete(elf);
        elves.add(tile);
        hasMoved = true;
      }
    }
    directions.push(directions.shift());
    rounds++;
  } while (hasMoved);
  return rounds;
}

run({
  part1: {
    tests: [
      {
        input: `
        ..............
        ..............
        .......#......
        .....###.#....
        ...#...#.#....
        ....#...##....
        ...#.###......
        ...##.#.##....
        ....#..#......
        ..............
        ..............
        ..............
        `,
        expected: 110,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ..............
        ..............
        .......#......
        .....###.#....
        ...#...#.#....
        ....#...##....
        ...#.###......
        ...##.#.##....
        ....#..#......
        ..............
        ..............
        ..............
        `,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
