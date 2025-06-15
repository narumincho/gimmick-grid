import {
  Direction,
  Position,
  positionEqual,
  positionMove,
  positionOnLine,
} from "./position.ts";

export type Item = Player | Wall | Ice | Wind;

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

export const move = (
  items: ReadonlyArray<Item>,
  direction: Direction,
): ReadonlyArray<Item> => {
  const newItems = [...items];
  for (const [playerIndex, player] of items.entries()) {
    if (player.type !== "player") continue;
    const movedPlayer = walkPlayer(newItems, direction, player);
    newItems[playerIndex] = movedPlayer;
  }
  return newItems;
};

const walkPlayer = (
  items: ReadonlyArray<Item>,
  direction: Direction,
  player: Player,
): Player => {
  if (checkWall(items, player.position, direction)) {
    return player;
  }
  let playerPosition = positionMove(player.position, direction);
  for (let i = 0; i < 999; i++) {
    const windDirection = isInWind(
      { items, position: playerPosition },
    );
    console.log(windDirection);
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
    } else if (windDirection) {
      if (
        checkWall(
          items,
          playerPosition,
          direction,
        )
      ) {
        return { type: "player", position: playerPosition };
      }
      playerPosition = positionMove(playerPosition, windDirection);
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

// 処理を修正
const isInWind = ({ items, position }: {
  readonly items: ReadonlyArray<Item>;
  readonly position: Position;
}): Direction | undefined => {
  for (const item of items) {
    if (item.type !== "wind") continue;
    if (
      isInWindInWind({
        items,
        playerPosition: position,
        windPosition: item.position,
        windDirection: item.direction,
      })
    ) {
      return item.direction;
    }
  }
};

const isInWindInWind = (
  { items, playerPosition, windPosition, windDirection }: {
    readonly items: ReadonlyArray<Item>;
    readonly playerPosition: Position;
    readonly windPosition: Position;
    readonly windDirection: Direction;
  },
): boolean => {
  if (windPosition.floor !== playerPosition.floor) {
    return false;
  }
  if (
    !positionOnLine({
      aPosition: windPosition,
      aDirection: windDirection,
      bPosition: playerPosition,
    })
  ) {
    return false;
  }
  let cursor: Position = windPosition;
  for (let i = 0; i < 99; i++) {
    if (checkWall(items, cursor, windDirection)) {
      return false;
    }
    cursor = positionMove(cursor, windDirection);
    if (positionEqual(cursor, playerPosition)) {
      return true;
    }
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
