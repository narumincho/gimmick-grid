export type Position = {
  readonly x: number;
  readonly y: number;
  readonly floor: number;
};

export type Direction = "up" | "down" | "left" | "right";

export const positionMove = (
  vector: Position,
  direction: Direction,
): Position => {
  switch (direction) {
    case "up":
      return { x: vector.x, y: vector.y - 1, floor: vector.floor };
    case "down":
      return { x: vector.x, y: vector.y + 1, floor: vector.floor };
    case "left":
      return { x: vector.x - 1, y: vector.y, floor: vector.floor };
    case "right":
      return { x: vector.x + 1, y: vector.y, floor: vector.floor };
  }
};

export const positionEqual = (
  a: Position,
  b: Position,
): boolean => a.x === b.x && a.y === b.y && a.floor === b.floor;

export const positionOnLine = (
  { aPosition, aDirection, bPosition }: {
    readonly aPosition: Position;
    aDirection: Direction;
    bPosition: Position;
  },
) => {
  switch (aDirection) {
    case "up":
      return aPosition.x === bPosition.x && aPosition.y < bPosition.y;
    case "down":
      return aPosition.x === bPosition.x && aPosition.y > bPosition.y;
    case "left":
      return aPosition.x < bPosition.x && aPosition.y === bPosition.y;
    case "right":
      return aPosition.x > bPosition.x && aPosition.y === bPosition.y;
  }
};

export const allDirections: ReadonlyArray<Direction> = [
  "up",
  "right",
  "down",
  "left",
];

const directionsLength = allDirections.length;

export const stepNumberToDirections = (
  stepNumber: number,
): ReadonlyArray<Direction> => {
  const directions: Direction[] = [];
  let num = stepNumber;
  for (let i = 0; i < 9; i++) {
    directions.push(allDirections[num % directionsLength]!);
    num = Math.floor(num / directionsLength);
  }
  return directions;
};

export const directionsToStepNumber = (
  directions: ReadonlyArray<Direction>,
): number => {
  let num = 0;
  for (const direction of directions.toReversed()) {
    num = num * directionsLength + allDirections.indexOf(direction);
  }
  return num;
};
