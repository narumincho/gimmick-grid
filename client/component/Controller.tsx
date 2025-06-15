import { PropsWithChildren } from "hono/jsx";
import { Direction } from "../position.ts";

export const Controller = ({ onMove, onReset, onStart }: {
  readonly onMove: (direction: Direction) => void;
  readonly onReset: () => void;
  readonly onStart: () => void;
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Button
        onClick={() => {
          onMove("up");
        }}
      >
        ↑
      </Button>
      <div style={{ display: "flex" }}>
        <Button
          onClick={() => {
            onMove("left");
          }}
        >
          ←
        </Button>
        <Button
          onClick={() => {
            onMove("right");
          }}
        >
          →
        </Button>
      </div>
      <Button
        onClick={() => {
          onMove("down");
        }}
      >
        ↓
      </Button>
      <Button onClick={onReset}>Reset</Button>
      <Button onClick={onStart}>総当たりの裏技</Button>
    </div>
  );
};

const Button = (
  { children, onClick }: PropsWithChildren<{ onClick: () => void }>,
) => {
  return (
    <button
      type="button"
      style={{ margin: 0, padding: 8, boxSizing: "border-box" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
