import run from "aocrunner";

function parseLine(line) {
  const [sx, sy, bx, by] = line.match(/-?\d+/g).map(Number);
  const distance = Math.abs(sx - bx) + Math.abs(sy - by);
  return {
    sensor: { x: sx, y: sy },
    beacon: { x: bx, y: by },
    distance: distance,
  };
}

function parseInput(rawInput) {
  return rawInput.split("\n").map(parseLine);
}

function findBlockedRangesInRow(targetY, sensorBeaconDetails) {
  const ranges = [];
  sensorBeaconDetails.forEach((detail) => {
    const distanceToTarget = Math.abs(targetY - detail.sensor.y);
    if (distanceToTarget <= detail.distance) {
      const x = detail.distance - distanceToTarget;
      ranges.push({ left: detail.sensor.x - x, right: detail.sensor.x + x });
    }
  });
  ranges.sort((interval1, interval2) => interval1.left - interval2.left);
  return ranges;
}

function countBlockedPositionsInRow(targetY, sensorBeaconDetails) {
  const ranges = findBlockedRangesInRow(targetY, sensorBeaconDetails);
  let current = ranges.shift();
  let count = current.right - current.left + 1;
  let last = current.right;
  while (ranges.length) {
    current = ranges.shift();
    if (last < current.left) {
      count += current.right - current.left + 1;
    } else if (current.right > last) {
      count += current.right - last;
    }
    last = Math.max(last, current.right);
  }
  const beaconsInTargetRow = sensorBeaconDetails.filter(
    (detail) => detail.beacon.y === targetY,
  );
  count -= new Set(beaconsInTargetRow.map((detail) => detail.beacon.x)).size;
  return count;
}

function findAvailablePositionInRow(targetY, sensorBeaconDetails) {
  const ranges = findBlockedRangesInRow(targetY, sensorBeaconDetails);
  let last = ranges.shift().right;
  while (ranges.length) {
    let current = ranges.shift();
    if (last < current.left) {
      return last + 1;
    }
    last = Math.max(last, current.right);
  }
}

function part1(rawInput) {
  const sensorBeaconDetails = parseInput(rawInput);
  return countBlockedPositionsInRow(2000000, sensorBeaconDetails);
}

function part2(rawInput) {
  const sensorBeaconDetails = parseInput(rawInput);
  for (let y = 0; y <= 4000000; y++) {
    const x = findAvailablePositionInRow(y, sensorBeaconDetails);
    if (x) {
      return x * 4000000 + y;
    }
  }
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
