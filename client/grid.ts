export type Item = Player | Wall | Ice;

export type Player = {
  readonly type: "player";
  readonly x: number;
  readonly y: number;
  readonly floor: number;
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
  if (checkWall(items, player.x, player.y, player.floor, direction)) {
    return player;
  }
  let movedPlayer = movePlayer(direction, player);
  for (let i = 0; i < 999; i++) {
    if (
      isOnIce({
        items,
        x: movedPlayer.x,
        y: movedPlayer.y,
        floor: movedPlayer.floor,
      })
    ) {
      if (
        checkWall(
          items,
          movedPlayer.x,
          movedPlayer.y,
          movedPlayer.floor,
          direction,
        )
      ) {
        return movedPlayer;
      }
      movedPlayer = movePlayer(direction, movedPlayer);
    } else {
      return movedPlayer;
    }
  }
  throw new Error("無限ループエラー");
};

const isOnIce = (
  { items, x, y, floor }: {
    items: ReadonlyArray<Item>;
    x: number;
    y: number;
    floor: number;
  },
): boolean => {
  return items.some((item) =>
    item.type === "ice" && item.x === x && item.y === y && item.floor === floor
  );
};

const movePlayer = (
  direction: Direction,
  player: Player,
): Player => {
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
