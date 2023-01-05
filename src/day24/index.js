import run from "aocrunner";

const Up = "^";
const Down = "v";
const Left = "<";
const Right = ">";

class Valley {
  #blizzards;
  #height;
  #width;

  constructor(blizzards, height, width) {
    this.#blizzards = blizzards;
    this.#height = height;
    this.#width = width;
  }

  travel(from, to) {
    let expeditions = new Set([this.#key(from)]);
    let minutes = 0;
    while (!expeditions.has(this.#key(to))) {
      this.#updateBlizzards();
      expeditions = this.#expandExpeditions(expeditions, from, to);
      minutes++;
    }
    return minutes;
  }

  #key({ row, column }) {
    return `${row},${column}`;
  }

  #coordinates(key) {
    return key.split(",").map(Number);
  }

  #updateBlizzards() {
    this.#blizzards.forEach((blizzard) => {
      const { row, column, direction } = blizzard;
      switch (direction) {
        case Right:
          blizzard.column = this.#incrementWithWrap(column, this.#width - 2);
          break;
        case Left:
          blizzard.column = this.#decrementWithWrap(column, this.#width - 2);
          break;
        case Up:
          blizzard.row = this.#decrementWithWrap(row, this.#height - 2);
          break;
        case Down:
          blizzard.row = this.#incrementWithWrap(row, this.#height - 2);
      }
    });
  }

  #incrementWithWrap(value, wrap) {
    return value === wrap ? 1 : value + 1;
  }

  #decrementWithWrap(value, wrap) {
    return value === 1 ? wrap : value - 1;
  }

  #isNonWall(row, column, from, to) {
    return (
      (row > 0 &&
        row < this.#height - 1 &&
        column > 0 &&
        column < this.#width - 1) ||
      (row === to.row && column === to.column) ||
      (row === from.row && column === from.column)
    );
  }

  #adjacentLocations(row, column) {
    return [
      [row, column],
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ];
  }

  #expandExpeditions(expeditions, from, to) {
    const blizzardKeys = new Set(this.#blizzards.map(this.#key));
    const result = new Set();
    expeditions.forEach((expedition) => {
      this.#adjacentLocations(...this.#coordinates(expedition))
        .filter(([r, c]) => this.#isNonWall(r, c, from, to))
        .map(([r, c]) => this.#key({ row: r, column: c }))
        .filter((k) => !blizzardKeys.has(k))
        .forEach((k) => result.add(k));
    });
    return result;
  }
}

function isBlizzard(ch) {
  return ch === Up || ch === Down || ch === Left || ch === Right;
}

function parseInput(rawInput) {
  const grid = rawInput.split("\n").map((line) => line.split(""));
  const height = grid.length;
  const width = grid[0].length;
  const blizzards = [];
  grid.forEach((row, r) => {
    row.forEach((ch, c) => {
      if (isBlizzard(ch)) {
        blizzards.push({ row: r, column: c, direction: ch });
      }
    });
  });
  const start = { row: 0, column: 1 };
  const destination = { row: height - 1, column: width - 2 };
  const valley = new Valley(blizzards, height, width);
  return { valley, start, destination };
}

function part1(rawInput) {
  const { valley, start, destination } = parseInput(rawInput);
  return valley.travel(start, destination);
}

function part2(rawInput) {
  const { valley, start, destination } = parseInput(rawInput);
  return (
    valley.travel(start, destination) +
    valley.travel(destination, start) +
    valley.travel(start, destination)
  );
}

run({
  part1: {
    tests: [
      {
        input: `
        #.######
        #>>.<^<#
        #.<..<<#
        #>v.><>#
        #<^v^^>#
        ######.#
        `,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.######
        #>>.<^<#
        #.<..<<#
        #>v.><>#
        #<^v^^>#
        ######.#
        `,
        expected: 54,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
