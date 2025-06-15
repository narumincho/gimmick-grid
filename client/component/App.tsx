import { Grid } from "./Grid.tsx";
import { isGoal, type Item, move } from "../grid.ts";
import { Controller } from "./Controller.tsx";
import { useEffect, useState } from "hono/jsx";
import {
  Direction,
  directionsToStepNumber,
  stepNumberToDirections,
} from "../position.ts";
import { StepsView } from "./StepsView.tsx";

const initialItems: ReadonlyArray<Item> = [
  // floor 0
  ...Array.from({ length: 5 }).flatMap((_, x) =>
    Array.from({ length: 5 }).map((_, y): Item => ({
      type: "ice",
      position: {
        floor: 0,
        x: 1 + x,
        y: 1 + y,
      },
    }))
  ),
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 2,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 3,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 4,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 5,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 4,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 6,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 3,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 6,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 3,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 5,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 6,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 3,
    y: 4,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 6,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 5,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 6,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 0,
    type: "wall",
    x: 1,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 2,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 3,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 4,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 0,
    type: "wall",
    x: 5,
    y: 6,
    direction: "horizontal",
  },
  {
    type: "goal",
    position: { floor: 0, x: 5, y: 5 },
  },
  {
    type: "player",
    position: { floor: 0, x: 1, y: 1 },
  },
  // floor 1
  {
    floor: 1,
    type: "wall",
    x: 1,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 2,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 4,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 5,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 1,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 6,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 1,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 2,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 4,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 3,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 6,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 2,
    y: 4,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 1,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 4,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 6,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 3,
    y: 5,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 5,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 6,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 1,
    type: "wall",
    x: 1,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 2,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 3,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 4,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 1,
    type: "wall",
    x: 5,
    y: 6,
    direction: "horizontal",
  },
  {
    type: "wind",
    position: { floor: 1, x: 3, y: 0 },
    direction: "down",
  },
  {
    type: "wind",
    position: { floor: 1, x: 6, y: 2 },
    direction: "left",
  },
  {
    type: "wind",
    position: {
      floor: 1,
      x: 0,
      y: 3,
    },
    direction: "right",
  },
  {
    type: "wind",
    position: {
      floor: 1,
      x: 0,
      y: 5,
    },
    direction: "right",
  },
  {
    type: "goal",
    position: { floor: 1, x: 5, y: 5 },
  },
  {
    type: "player",
    position: { floor: 1, x: 1, y: 1 },
  },
  // floor 2
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 2,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 3,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 4,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 5,
    y: 1,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 6,
    y: 1,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 6,
    y: 2,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 6,
    y: 3,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 6,
    y: 4,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 6,
    y: 5,
    direction: "vertical",
  },
  {
    floor: 2,
    type: "wall",
    x: 1,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 2,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 3,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 4,
    y: 6,
    direction: "horizontal",
  },
  {
    floor: 2,
    type: "wall",
    x: 5,
    y: 6,
    direction: "horizontal",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 1, y: 5 },
    b: { floor: 2, x: 4, y: 5 },
    label: "A",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 5, y: 1 },
    b: { floor: 2, x: 5, y: 4 },
    label: "B",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 2, y: 1 },
    b: { floor: 2, x: 2, y: 3 },
    label: "C",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 1, y: 2 },
    b: { floor: 2, x: 5, y: 2 },
    label: "D",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 3, y: 2 },
    b: { floor: 2, x: 2, y: 5 },
    label: "E",
  },
  {
    type: "warpPair",
    a: { floor: 2, x: 3, y: 1 },
    b: { floor: 2, x: 2, y: 4 },
    label: "F",
  },
  {
    type: "goal",
    position: { floor: 2, x: 5, y: 5 },
  },
  {
    type: "player",
    position: { floor: 2, x: 1, y: 1 },
  },
];

const applySteps = (stepId: number) => {
  let items = initialItems;
  for (const direction of stepNumberToDirections(stepId)) {
    items = move(items, direction);
  }
  return items;
};

export const App = () => {
  const [items, setItems] = useState<ReadonlyArray<Item>>(initialItems);
  const [steps, setSteps] = useState<ReadonlyArray<Direction>>([]);
  const [stepsNumber, setStepsNumber] = useState<number | undefined>(undefined);
  const [okStepsNumberSet, setOkStepsNumberSet] = useState<ReadonlySet<number>>(
    new Set(),
  );

  useEffect(() => {
    if (stepsNumber === undefined) return;

    const tick = () => {
      if (4 ** 9 < stepsNumber) {
        console.log("完了!", new Date());
        setStepsNumber(undefined);
        return;
      }
      const right = stepsNumber + 1;
      const down = stepsNumber + 2;

      {
        const moved = applySteps(right);
        setSteps(stepNumberToDirections(right));
        setItems(moved);
        if (isGoal(moved)) {
          console.log(right);
          setOkStepsNumberSet((prev) => new Set(prev).add(right));
        }
      }

      {
        setSteps(stepNumberToDirections(down));
        const moved = applySteps(down);
        setItems(moved);
        if (isGoal(moved)) {
          console.log(down);

          setOkStepsNumberSet((prev) => new Set(prev).add(down));
        }
      }

      setStepsNumber(stepsNumber + 4);
    };

    const f = () => {
      return requestAnimationFrame(tick);
    };

    const id: number = f();

    return () => {
      cancelAnimationFrame(id);
    };
  }, [stepsNumber === undefined, stepsNumber]);

  return (
    <div
      style={{
        height: "100%",
        padding: 16,
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      <Grid width={7} height={6} floorSize={3} items={items} />
      <div>
        <Controller
          onMove={(direction) => {
            const newSteps = [...steps, direction];
            const moved = move(items, direction);
            if (steps.length === 9) {
              if (isGoal(moved)) {
                setOkStepsNumberSet((prev) =>
                  new Set(prev).add(directionsToStepNumber(newSteps))
                );
              }
              setSteps([]);
              setItems(initialItems);
            } else {
              setSteps(newSteps);
              setItems(moved);
            }
          }}
          onReset={() => {
            setSteps([]);
            setItems(initialItems);
          }}
          onStart={() => {
            console.log("開始!", new Date());
            setStepsNumber(0);
            // setStepsNumber(4 ** 8 * 2);
          }}
        />

        {stepsNumber === undefined
          ? undefined
          : <StepsView steps={stepNumberToDirections(stepsNumber)} />}
        <div style={{ borderBottom: "solid 1px black" }} />
        {[...okStepsNumberSet].map((okStepsNumber, index) => (
          <StepsView
            key={index}
            steps={stepNumberToDirections(okStepsNumber)}
          />
        ))}
      </div>
    </div>
  );
};
