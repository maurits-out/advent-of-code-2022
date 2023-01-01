import run from "aocrunner";

class Facing {
  static Right = new Facing(0);
  static Down = new Facing(1);
  static Left = new Facing(2);
  static Up = new Facing(3);

  constructor(value) {
    this.value = value;
  }

  turn(direction) {
    if (direction === "L") {
      return this.#turnLeft();
    }
    return this.#turnRight();
  }

  #turnLeft() {
    switch (this) {
      case Facing.Up:
        return Facing.Left;
      case Facing.Left:
        return Facing.Down;
      case Facing.Down:
        return Facing.Right;
      case Facing.Right:
        return Facing.Up;
    }
  }

  #turnRight() {
    switch (this) {
      case Facing.Up:
        return Facing.Right;
      case Facing.Right:
        return Facing.Down;
      case Facing.Down:
        return Facing.Left;
      case Facing.Left:
        return Facing.Up;
    }
  }
}

class Position {
  constructor(row, column, facing) {
    this.row = row;
    this.column = column;
    this.facing = facing;
  }

  turn(direction) {
    return new Position(this.row, this.column, this.facing.turn(direction));
  }

  get finalPassword() {
    return 1000 * (this.row + 1) + 4 * (this.column + 1) + this.facing.value;
  }
}

class StepStrategy {
  left(_position, _board) {
    throw new Error("Method not implemented");
  }

  right(_position, _board) {
    throw new Error("Method not implemented");
  }

  up(_position, _board) {
    throw new Error("Method not implemented");
  }

  down(_position, _board) {
    throw new Error("Method not implemented");
  }
}

class Part1StepStrategy {
  left({ row, column, facing }, board) {
    const newColumn =
      column === 0 || board[row][column - 1] === " "
        ? board[row].findLastIndex((ch) => ch !== " ")
        : column - 1;
    return new Position(row, newColumn, facing);
  }

  right({ row, column, facing }, board) {
    const newColumn =
      column === board[row].length - 1
        ? board[row].findIndex((ch) => ch !== " ")
        : column + 1;
    return new Position(row, newColumn, facing);
  }

  up({ row, column, facing }, board) {
    const newRow =
      row === 0 || !board[row - 1][column] || board[row - 1][column] === " "
        ? board.findLastIndex((r) => r[column] && r[column] !== " ")
        : row - 1;
    return new Position(newRow, column, facing);
  }

  down({ row, column, facing }, board) {
    const newRow =
      row === board.length - 1 ||
      !board[row + 1][column] ||
      board[row + 1][column] === " "
        ? board.findIndex((r) => r[column] && r[column] !== " ")
        : row + 1;
    return new Position(newRow, column, facing);
  }
}

class Part2StepStrategy {
  left({ row, column, facing }, board) {
    if (column === 0 || board[row][column - 1] === " ") {
      if (row <= 49) {
        return new Position(149 - row, 0, Facing.Right);
      } else if (row <= 99) {
        return new Position(100, row - 50, Facing.Down);
      } else if (row <= 149) {
        return new Position(149 - row, 50, Facing.Right);
      }
      return new Position(0, row - 100, Facing.Down);
    }
    return new Position(row, column - 1, facing);
  }

  right({ row, column, facing }, board) {
    if (column === board[row].length - 1) {
      if (row <= 49) {
        return new Position(149 - row, 99, Facing.Left);
      } else if (row <= 99) {
        return new Position(49, row + 50, Facing.Up);
      } else if (row <= 149) {
        return new Position(149 - row, 149, Facing.Left);
      }
      return new Position(149, row - 100, Facing.Up);
    }
    return new Position(row, column + 1, facing);
  }

  up({ row, column, facing }) {
    if (row === 0 && column <= 99) {
      return new Position(column + 100, 0, Facing.Right);
    } else if (row === 0 && column <= 149) {
      return new Position(199, column - 100, Facing.Up);
    } else if (row === 100 && column <= 49) {
      return new Position(column + 50, 50, Facing.Right);
    }
    return new Position(row - 1, column, facing);
  }

  down({ row, column, facing }) {
    if (row === 49 && column >= 100) {
      return new Position(column - 50, 99, Facing.Left);
    } else if (row === 149 && column >= 50) {
      return new Position(column + 100, 49, Facing.Left);
    } else if (row === 199) {
      return new Position(0, column + 100, Facing.Down);
    }
    return new Position(row + 1, column, facing);
  }
}

function parseInput(rawInput) {
  const sections = rawInput.split("\n\n");
  const board = sections[0].split("\n").map((line) => line.split(""));
  const path = sections[1].match(/\d+|L|R/g);
  return { board, path };
}

function step(stepStrategy, position, board) {
  let nextPosition;
  switch (position.facing) {
    case Facing.Right:
      nextPosition = stepStrategy.right(position, board);
      break;
    case Facing.Left:
      nextPosition = stepStrategy.left(position, board);
      break;
    case Facing.Up:
      nextPosition = stepStrategy.up(position, board);
      break;
    case Facing.Down:
      nextPosition = stepStrategy.down(position, board);
  }
  return board[nextPosition.row][nextPosition.column] === "#"
    ? position
    : nextPosition;
}

function initialPosition(board) {
  return new Position(0, board[0].findIndex((ch) => ch === "."), Facing.Right);
}

function doSteps(stepStrategy, stepCount, position, board) {
  let current = position;
  for (let i = 0; i < stepCount; i++) {
    const next = step(stepStrategy, current, board);
    if (next === current) {
      break;
    }
    current = next;
  }
  return current;
}

function followPath({ board, path }, stepStrategy) {
  let position = initialPosition(board);
  for (const instruction of path) {
    const num = Number(instruction);
    if (Number.isInteger(num)) {
      position = doSteps(stepStrategy, num, position, board);
    } else {
      position = position.turn(instruction);
    }
  }
  return position.finalPassword;
}

function part1(rawInput) {
  return followPath(parseInput(rawInput), new Part1StepStrategy());
}

function part2(rawInput) {
  return followPath(parseInput(rawInput), new Part2StepStrategy());
}

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
