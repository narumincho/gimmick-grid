export type Item = Player | {
  readonly type: "wall";
  readonly x: number;
  readonly y: number;
  readonly direction: "horizontal" | "vertical";
  readonly floor: number;
};

export type Player = {
  readonly type: "player";
  readonly x: number;
  readonly y: number;
  readonly floor: number;
};

export type Direction = "up" | "down" | "left" | "right";

export const move = (
  items: ReadonlyArray<Item>,
  direction: Direction,
): ReadonlyArray<Item> => {
  const newItems = [...items];
  for (const [playerIndex, player] of items.entries()) {
    if (player.type !== "player") continue;
    newItems[playerIndex] = movePlayer(newItems, direction, player);
  }
  return newItems;
};

const movePlayer = (
  items: ReadonlyArray<Item>,
  direction: Direction,
  player: Player,
): Item => {
  if (checkWall(items, player.x, player.y, player.floor, direction)) {
    return player;
  }
  switch (direction) {
    case "up":
      return { ...player, y: player.y - 1 };
    case "down":
      return { ...player, y: player.y + 1 };
    case "left":
      return { ...player, x: player.x - 1 };
    case "right":
      return { ...player, x: player.x + 1 };
  }
};

const checkWall = (
  items: ReadonlyArray<Item>,
  x: number,
  y: number,
  floor: number,
  direction: Direction,
): boolean => {
  for (const item of items) {
    if (item.type !== "wall") continue;
    if (item.floor !== floor) continue;

    switch (item.direction) {
      case "horizontal":
        if (item.x !== x) continue;

        if (direction === "up" && item.y === y) return true;
        if (direction === "down" && item.y === y + 1) return true;
        break;
      case "vertical":
        if (item.y !== y) continue;
        if (direction === "left" && item.x === x) return true;
        if (direction === "right" && item.x === x + 1) return true;
    }
  }
  return false;
};
