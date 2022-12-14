import run from "aocrunner";

function parseLine(line) {
  return line
    .split(" -> ")
    .map((coordinates) => coordinates.split(",").map((s) => Number(s)));
}

function expandPath(path) {
  const result = []
  for (let i = 0; i < path.length - 1; i++) {
    const [fx, fy] = path[i];
    const [tx, ty] = path[i + 1];
    if (fx === tx) {
      for (let y = Math.min(fy, ty); y <= Math.max(fy, ty); y++) {
        result.push([fx, y]);
      }
    } else {
      for (let x = Math.min(fx, tx); x <= Math.max(fx, tx); x++) {
        result.push([x, fy]);
      }
    }
  }
  return result;
}

function parseInput(rawInput) {
  const points = rawInput.split("\n").map((line) => parseLine(line)).flatMap(path => expandPath(path));
  const abyssMarker = Math.max(...points.map(([_, y]) => y)) + 2;
  return {
    rocks: new Set(points.map(p => p.toString())),
    abyssMarker: abyssMarker
  };
}

function part1(rawInput) {
  const { rocks, abyssMarker } = parseInput(rawInput);

  const occupied = rocks;
  let inAbyss = false;
  let sandAtRestCount = 0;
  while (!inAbyss) {
    let sand = [500, 0];
    let isAtRest = false;
    while (!isAtRest && !inAbyss) {
      if (sand[1] === abyssMarker) {
        inAbyss = true;
        continue;
      }
      const down = [sand[0], sand[1] + 1];
      if (!occupied.has(down.toString())) {
        sand = down;
        continue;
      }
      const diagLeft = [sand[0] - 1, sand[1] + 1];
      if (!occupied.has(diagLeft.toString())) {
        sand = diagLeft;
        continue;
      }
      const diagRight = [sand[0] + 1, sand[1] + 1];
      if (!occupied.has(diagRight.toString())) {
        sand = diagRight;
        continue;
      }
      sandAtRestCount++;
      isAtRest = true;
      occupied.add(sand.toString());
      break;
    }  
  }
  return sandAtRestCount;
}

const part2 = (rawInput) => {
  const { rocks, abyssMarker } = parseInput(rawInput);

  const occupied = rocks;
  const start = [500, 0];
  let sandAtRestCount = 0;
  while (!occupied.has(start.toString())) {
    let sand = [500, 0];
    let isAtRest = false;
    while (!isAtRest) {
      const down = [sand[0], sand[1] + 1];
      if (sand[1] + 1 < abyssMarker) {
        if (!occupied.has(down.toString())) {
          sand = down;
          continue;
        }
        const diagLeft = [sand[0] - 1, sand[1] + 1];
        if (!occupied.has(diagLeft.toString())) {
          sand = diagLeft;
          continue;
        }
        const diagRight = [sand[0] + 1, sand[1] + 1];
        if (!occupied.has(diagRight.toString())) {
          sand = diagRight;
          continue;
        }  
      }
      sandAtRestCount++;
      isAtRest = true;
      occupied.add(sand.toString());
      break;
    }  
  }
  return sandAtRestCount;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9        
      `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9        
      `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
