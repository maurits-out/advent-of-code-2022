import run from "aocrunner";

function renderRock(rockType, row) {
  switch (rockType) {
    case 0:
      return [
        [row, 2],
        [row, 3],
        [row, 4],
        [row, 5],
      ];
    case 1:
      return [
        [row, 3],
        [row + 1, 2],
        [row + 1, 3],
        [row + 1, 4],
        [row + 2, 3],
      ];
    case 2:
      return [
        [row, 2],
        [row, 3],
        [row, 4],
        [row + 1, 4],
        [row + 2, 4],
      ];
    case 3:
      return [
        [row, 2],
        [row + 1, 2],
        [row + 2, 2],
        [row + 3, 2],
      ];
    case 4:
      return [
        [row, 2],
        [row, 3],
        [row + 1, 2],
        [row + 1, 3],
      ];
  }
}

function applyJet(rock, jet) {
  const step = jet === ">" ? 1 : -1;
  return rock.map(([r, c]) => [r, c + step]);
}

function fallDown(rock) {
  return rock.map(([r, c]) => [r - 1, c]);
}

function isValid(rock, chamber) {
  for (const [r, c] of rock) {
    if (c < 0 || c > 6) {
      return false;
    }
    if (r < 0) {
      return false;
    }
    const occupied = chamber[r];
    if (occupied && occupied.has(c)) {
      return false;
    }
  }
  return true;
}

function updateChamber(chamber, rock) {
  for (const [r, c] of rock) {
    if (!chamber[r]) {
      chamber[r] = new Set();
    }
    chamber[r].add(c);
  }
}

function createState(rockType, jetIndex, chamber) {
  const state = [rockType, jetIndex];
  for (let c = 0; c < 7; c++) {
    let highest = -1;
    for (let r = chamber.length - 1; r >= 0; r--) {
      if (chamber[r].has(c)) {
        highest = r;
        break;
      }
    }
    state.push(chamber.length - highest);
  }
  return state.join("/");
}

function dropRocks(numRocks, jetPattern) {
  const chamber = [];
  const states = new Map();
  let heightToAdd = 0;
  let jetIndex = 0;
  for (let r = 0; r < numRocks; r++) {
    const rockType = r % 5;
    let rock = renderRock(rockType, chamber.length + 3);
    while (true) {
      const afterJet = applyJet(rock, jetPattern[jetIndex % jetPattern.length]);
      jetIndex++;
      if (isValid(afterJet, chamber)) {
        rock = afterJet;
      }
      const afterFall = fallDown(rock);
      if (isValid(afterFall, chamber)) {
        rock = afterFall;
      } else {
        updateChamber(chamber, rock);
        break;
      }
    }
    const state = createState(r % 5, jetIndex % jetPattern.length, chamber);
    if (states.has(state) && !heightToAdd) {
      const { rockCount, height } = states.get(state);
      const cycleLength = r - rockCount;
      const numCycles = Math.floor((numRocks - r) / cycleLength) - 1;
      r += numCycles * cycleLength;
      heightToAdd = numCycles * (chamber.length - height);
    } else {
      states.set(state, { rockCount: r, height: chamber.length });
    }
  }
  return chamber.length + heightToAdd;
}

function part1(jetPattern) {
  return dropRocks(2022, jetPattern);
}

function part2(jetPattern) {
  return dropRocks(1000000000000, jetPattern);
}

run({
  part1: {
    tests: [
      {
        input: ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>",
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>",
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
