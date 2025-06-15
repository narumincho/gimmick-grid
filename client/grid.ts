import {
  Direction,
  Position,
  positionEqual,
  positionMove,
} from "./position.ts";

export type Item = Player | Wall | Ice | Wind | WarpPair | Goal;

export type Player = {
  readonly type: "player";
  readonly position: Position;
};

export type Wall = {
  readonly type: "wall";
  readonly x: number;
  readonly y: number;
  readonly direction: "horizontal" | "vertical";
  readonly floor: number;
};

export type Ice = {
  readonly type: "ice";
  readonly position: Position;
};

export type Wind = {
  readonly type: "wind";
  readonly position: Position;
  readonly direction: Direction;
};

export type WarpPair = {
  readonly type: "warpPair";
  readonly a: Position;
  readonly b: Position;
  readonly label: string;
};

export type Goal = {
  readonly type: "goal";
  readonly position: Position;
};

export const move = (
  items: ReadonlyArray<Item>,
  direction: Direction,
): ReadonlyArray<Item> => {
  const warpPoints = createWarpPoints(items);
  const newItems = [...items];
  for (const [playerIndex, player] of items.entries()) {
    if (player.type !== "player") continue;
    const movedPlayer = walkPlayer({
      items: newItems,
      direction,
      player,
      warpPoints,
    });
    newItems[playerIndex] = movedPlayer;
  }
  return newItems;
};

const walkPlayer = (
  { items, direction, player, warpPoints }: {
    items: ReadonlyArray<Item>;
    direction: Direction;
    player: Player;
    warpPoints: ReadonlyArray<WarpPoint>;
  },
): Player => {
  if (checkWall(items, player.position, direction)) {
    return player;
  }
  let playerPosition = positionMove(player.position, direction);
  for (let i = 0; i < 999; i++) {
    const matchedWarpPoint = warpPoints.find(({ from }) =>
      positionEqual(from, playerPosition)
    );
    if (matchedWarpPoint) {
      return { type: "player", position: matchedWarpPoint.to };
    }
    if (isOnIce(items, playerPosition)) {
      if (
        checkWall(
          items,
          playerPosition,
          direction,
        )
      ) {
        return { type: "player", position: playerPosition };
      }
      playerPosition = positionMove(playerPosition, direction);
    } else {
      return { type: "player", position: playerPosition };
    }
  }
  throw new Error("無限ループエラー");
};

const isOnIce = (
  items: ReadonlyArray<Item>,
  position: Position,
): boolean => {
  return items.some((item) =>
    item.type === "ice" && positionEqual(item.position, position)
  );
};

type WarpPoint = {
  readonly from: Position;
  readonly to: Position;
};

const createWarpPoints = (
  items: ReadonlyArray<Item>,
): ReadonlyArray<WarpPoint> =>
  items.flatMap((item) => {
    switch (item.type) {
      case "player":
      case "wall":
      case "ice":
      case "goal":
        return [];
      case "wind":
        return createWindWarpPoints({
          items,
          windPosition: item.position,
          windDirection: item.direction,
        });
      case "warpPair":
        return [{ from: item.a, to: item.b }, { from: item.b, to: item.a }];
    }
  });

const createWindWarpPoints = ({ items, windDirection, windPosition }: {
  readonly items: ReadonlyArray<Item>;
  readonly windPosition: Position;
  readonly windDirection: Direction;
}): ReadonlyArray<WarpPoint> => {
  let cursor: Position = windPosition;
  const startPositions: Position[] = [];
  for (let i = 0; i < 99; i++) {
    if (checkWall(items, cursor, windDirection)) {
      return startPositions.map((startPosition) => ({
        from: startPosition,
        to: cursor,
      }));
    }
    cursor = positionMove(cursor, windDirection);
    startPositions.push(cursor);
  }
  throw new Error("風の計算で無限ループ");
};

const checkWall = (
  items: ReadonlyArray<Item>,
  position: Position,
  direction: Direction,
): boolean => {
  for (const item of items) {
    if (item.type !== "wall") continue;
    if (item.floor !== position.floor) continue;

    switch (item.direction) {
      case "horizontal":
        if (item.x !== position.x) continue;
        if (direction === "up" && item.y === position.y) return true;
        if (direction === "down" && item.y === position.y + 1) return true;
        break;
      case "vertical":
        if (item.y !== position.y) continue;
        if (direction === "left" && item.x === position.x) return true;
        if (direction === "right" && item.x === position.x + 1) return true;
    }
  }
  return false;
};

export const isGoal = (items: ReadonlyArray<Item>): boolean =>
  items.filter((item) => item.type === "player").every((player) =>
    items.some((item) =>
      item.type === "goal" && positionEqual(item.position, player.position)
    )
  );
