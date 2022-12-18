import run from "aocrunner";

function parseInput(rawInput) {
  return new Set(rawInput.split("\n"));
}

function getNeighbors(cube) {
  const [x, y, z] = cube.split(",").map(Number);
  return [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ].map((c) => c.join(","));
}

function calculateSurface(cubes) {
  const placed = new Set();
  let surface = 0;
  for (const cube of cubes) {
    placed.add(cube);
    surface += 6 - 2 * getNeighbors(cube).filter((c) => placed.has(c)).length;
  }
  return surface;
}

function calculateRanges(cubes) {
  const coordinates = Array.from(cubes).map((c) => c.split(",").map(Number));
  const xs = coordinates.map((c) => c[0]);
  const ys = coordinates.map((c) => c[1]);
  const zs = coordinates.map((c) => c[2]);
  return [
    { minX: Math.min(...xs), maxX: Math.max(...xs) },
    { minY: Math.min(...ys), maxY: Math.max(...ys) },
    { minZ: Math.min(...zs), maxZ: Math.max(...zs) },
  ];
}

function findAirCubes(lavaDroplets, ranges) {
  const [{ minX, maxX }, { minY, maxY }, { minZ, maxZ }] = ranges;
  const airCubes = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const cube = [x, y, z].join(",");
        if (!lavaDroplets.has(cube)) {
          airCubes.push(cube);
        }
      }
    }
  }
  return airCubes;
}

function isCubeWithinRanges(cube, ranges) {
  const [{ minX, maxX }, { minY, maxY }, { minZ, maxZ }] = ranges;
  const [x, y, z] = cube.split(",").map(Number);
  return (
    minX <= x && x <= maxX && minY <= y && y <= maxY && minZ <= z && z <= maxZ
  );
}

function isTrapped(airCube, lavaDroplets, ranges) {
  const todo = [airCube];
  const visited = new Set([airCube]);
  while (todo.length) {
    const current = todo.shift();
    if (!isCubeWithinRanges(current, ranges)) {
      return false;
    }
    const newNeighbors = getNeighbors(current).filter(
      (c) => !(lavaDroplets.has(c) || visited.has(c)),
    );
    newNeighbors.forEach((c) => visited.add(c));
    todo.push(...newNeighbors);
  }
  return true;
}

function part1(rawInput) {
  return calculateSurface(parseInput(rawInput));
}

function part2(rawInput) {
  const lavaDroplets = parseInput(rawInput);
  const ranges = calculateRanges(lavaDroplets);
  const trapped = findAirCubes(lavaDroplets, ranges).filter((c) =>
    isTrapped(c, lavaDroplets, ranges),
  );
  return calculateSurface(lavaDroplets) - calculateSurface(trapped);
}

run({
  part1: {
    tests: [
      {
        input: `
        2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
