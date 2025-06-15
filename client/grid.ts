export type Item = {
  readonly type: "player";
  readonly x: number;
  readonly y: number;
  readonly floor: number;
} | {
  readonly type: "wall";
  readonly x: number;
  readonly y: number;
  readonly direction: "horizontal" | "vertical";
  readonly floor: number;
};
