import run from "aocrunner";

const Ore = 1;
const Clay = 2;
const Obsidian = 3;
const Geode = 4;
const ResourceTypes = [Ore, Clay, Obsidian, Geode];

class Node {
  constructor(state) {
    this.state = state;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
  }

  push(state) {
    let node = new Node(state);
    node.next = this.top;
    this.top = node;
  }

  pop() {
    if (!this.top) {
      return null;
    }
    let state = this.top.state;
    this.top = this.top.next;
    return state;
  }

  isEmpty() {
    return !this.top;
  }
}

function parseLine(line) {
  const fields = line.match(/\d+/g).map(Number);
  const oreRobot = new Map([
    [Ore, fields[1]],
    [Clay, 0],
    [Obsidian, 0],
  ]);
  const clayRobot = new Map([
    [Ore, fields[2]],
    [Clay, 0],
    [Obsidian, 0],
  ]);
  const obsidianRobot = new Map([
    [Ore, fields[3]],
    [Clay, fields[4]],
    [Obsidian, 0],
  ]);
  const geodeRobot = new Map([
    [Ore, fields[5]],
    [Clay, 0],
    [Obsidian, fields[6]],
  ]);
  return {
    id: fields[0],
    costs: new Map([
      [Ore, oreRobot],
      [Clay, clayRobot],
      [Obsidian, obsidianRobot],
      [Geode, geodeRobot],
    ]),
    max: new Map([
      [Ore, Math.max(fields[1], fields[2], fields[3], fields[5])],
      [Clay, fields[4]],
      [Obsidian, fields[6]],
    ]),
  };
}

function parseInput(rawInput) {
  return rawInput.split("\n").map(parseLine);
}

function initialState(time) {
  const robotCounts = new Map(ResourceTypes.map((rt) => [rt, 0]));
  robotCounts.set(Ore, 1);
  const resourceCounts = new Map(ResourceTypes.map((rt) => [rt, 0]));
  return {
    robotCounts: robotCounts,
    resourceCounts: resourceCounts,
    building: null,
    timeRemaining: time,
  };
}

function canBuildRobot(resourceType, state, blueprint) {
  const currentRobotCount = state.robotCounts.get(resourceType);
  if (
    resourceType !== Geode &&
    currentRobotCount * state.timeRemaining +
      state.resourceCounts.get(resourceType) >=
      blueprint.max.get(resourceType) * state.timeRemaining
  ) {
    return false;
  }
  return Array.from(blueprint.costs.get(resourceType)).every(
    ([resource, cost]) => state.resourceCounts.get(resource) >= cost,
  );
}

function buildRobot(type, state, blueprint) {
  Array.from(blueprint.costs.get(type)).forEach(([resource, cost]) =>
    state.resourceCounts.set(
      resource,
      state.resourceCounts.get(resource) - cost,
    ),
  );
  state.building = type;
}

function collectResources(state) {
  Array.from(state.robotCounts).forEach(([resource, count]) =>
    state.resourceCounts.set(
      resource,
      state.resourceCounts.get(resource) + count,
    ),
  );
}

function updateBuiltRobot(state) {
  if (state.building) {
    const resource = state.building;
    state.robotCounts.set(resource, state.robotCounts.get(resource) + 1);
    state.building = null;
  }
}

function maxNumGeodesPossible(state) {
  const timeRemaining = state.timeRemaining;
  const currentAmountOfGeodes = state.resourceCounts.get(Geode);
  const amountToBeProducedByCurrentRobots =
    timeRemaining * state.robotCounts.get(Geode);
  const maxAmountToBeProducedByNewRobots =
    (timeRemaining * (timeRemaining - 1)) / 2;
  return (
    currentAmountOfGeodes +
    amountToBeProducedByCurrentRobots +
    maxAmountToBeProducedByNewRobots
  );
}

function copyState(state) {
  return {
    robotCounts: new Map(state.robotCounts),
    resourceCounts: new Map(state.resourceCounts),
    building: state.building,
    timeRemaining: state.timeRemaining,
  };
}

function nextStates(state, blueprint) {
  const result = [];
  ResourceTypes.filter((type) => canBuildRobot(type, state, blueprint)).forEach(
    (type) => {
      const nextState = copyState(state);
      buildRobot(type, nextState, blueprint);
      collectResources(nextState);
      updateBuiltRobot(nextState);
      result.push(nextState);
    },
  );
  const nextState = copyState(state);
  collectResources(nextState);
  result.push(nextState);
  result.forEach((nextState) => nextState.timeRemaining--);
  return result;
}

function stateToKey(state) {
  const attrs = [];
  attrs.push(state.timeRemaining);
  attrs.push(...state.resourceCounts.values());
  attrs.push(...state.robotCounts.values());
  const key = attrs.join();
  return key;
}

function calculateMaxGeodeCount(blueprint, time) {
  const stack = new Stack();
  const seen = new Set();

  const start = initialState(time);
  stack.push(start);
  seen.add(stateToKey(start));

  let currentMax = 0;
  while (!stack.isEmpty()) {
    const state = stack.pop();
    if (state.timeRemaining === 0) {
      continue;
    }
    nextStates(state, blueprint)
      .filter((nextState) => maxNumGeodesPossible(nextState) >= currentMax)
      .forEach((nextState) => {
        const key = stateToKey(nextState);
        if (!seen.has(key)) {
          currentMax = Math.max(
            currentMax,
            nextState.resourceCounts.get(Geode),
          );
          seen.add(key);
          stack.push(nextState);
        }
      });
  }
  return currentMax;
}

function part1(rawInput) {
  return parseInput(rawInput)
    .map((bp, idx) => (idx + 1) * calculateMaxGeodeCount(bp, 24))
    .reduce((acc, n) => acc + n, 0);
}

function part2(rawInput) {
  return parseInput(rawInput)
    .slice(0, 3)
    .map((bp) => calculateMaxGeodeCount(bp, 32))
    .reduce((acc, n) => acc * n, 1);
}

run({
  part1: {
    tests: [
      {
        input: `
        Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
        Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
        `,
        expected: 33,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
