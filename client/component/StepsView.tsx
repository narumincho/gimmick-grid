import { FC } from "hono/jsx";
import { Direction } from "../position.ts";

export const StepsView: FC<{ steps: ReadonlyArray<Direction> }> = (
  { steps },
) => {
  return (
    <div style={{ display: "flex", gap: 2, fontSize: 32, width: 320 }}>
      {steps.map((step, index) => (
        <span key={index}>
          {{ up: "↑", down: "↓", left: "←", right: "→" }[step]}
        </span>
      ))}
    </div>
  );
};
