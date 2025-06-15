import { FC } from "hono/jsx";
import type { Item, Wall } from "../grid.ts";

const floorGap = 2;

export const Grid = (
  { items, width, height, floorSize }: {
    readonly items: ReadonlyArray<Item>;
    readonly width: number;
    readonly height: number;
    readonly floorSize: number;
  },
) => {
  return (
    <svg
      viewBox={`-0.5 -0.5 ${width + 1} ${
        height * floorSize + (floorSize - 1) * floorGap + 1
      }`}
      style={{ display: "block", objectFit: "contain", height: "100%" }}
    >
      {Array.from({ length: floorSize }).map((_, floorIndex) => (
        <g
          key={floorIndex}
          title={`floor-${floorIndex}`}
          transform={`translate(0, ${floorIndex * (height + floorGap)})`}
        >
          <Floor
            width={width}
            height={height}
            items={items.filter((item) => {
              if (item.type === "wall") {
                return item.floor === floorIndex;
              } else {
                return item.position.floor === floorIndex;
              }
            })}
          />
        </g>
      ))}
    </svg>
  );
};

export const Floor = (
  { items, width, height }: {
    readonly items: ReadonlyArray<Item>;
    readonly width: number;
    readonly height: number;
  },
) => {
  return (
    <>
      <g title="grid-line-x">
        {Array.from({ length: width + 1 }).map((_, x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={0}
            y2={height}
            stroke="gray"
            strokeWidth={0.02}
          />
        ))}
      </g>
      <g title="grid-line-y">
        {Array.from({ length: height + 1 }).map((_, y) => (
          <line
            key={y}
            x1={0}
            x2={width}
            y1={y}
            y2={y}
            stroke="gray"
            strokeWidth={0.02}
          />
        ))}
      </g>
      <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
      {items.map((item, index) => <Item key={index} item={item} />)}
    </>
  );
};

const Item: FC<{ readonly item: Item }> = ({ item }) => {
  switch (item.type) {
    case "player":
      return (
        <circle cx={item.position.x + 0.5} cy={item.position.y + 0.5} r={0.4} />
      );
    case "wall": {
      return <Wall wall={item} />;
    }
    case "ice": {
      return (
        <rect
          x={item.position.x}
          y={item.position.y}
          width={1}
          height={1}
          fill="skyblue"
        />
      );
    }
    case "wind": {
      return (
        <g
          transform={`translate(${item.position.x + 0.5}, ${
            item.position.y + 0.5
          })`}
        >
          <polygon
            points={[
              { x: -0.1, y: -0.4 },
              { x: 0.1, y: -0.4 },
              { x: 0.1, y: 0 },
              { x: 0.3, y: 0 },
              { x: 0, y: 0.4 },
              { x: -0.3, y: 0 },
              { x: -0.1, y: 0 },
            ].map(({ x, y }) => `${x},${y}`)}
            transform={`rotate(${
              { down: 0, left: 90, up: 180, right: 270 }[item.direction]
            })`}
            stroke="black"
            strokeWidth={0.1}
          />
        </g>
      );
    }
  }
};

const Wall: FC<{ readonly wall: Wall }> = ({ wall }) => {
  switch (wall.direction) {
    case "horizontal":
      return (
        <line
          x1={wall.x}
          y1={wall.y}
          x2={wall.x + 1}
          y2={wall.y}
          stroke="black"
          strokeWidth={0.1}
        />
      );

    case "vertical":
      return (
        <line
          x1={wall.x}
          y1={wall.y}
          x2={wall.x}
          y2={wall.y + 1}
          stroke="black"
          strokeWidth={0.1}
        />
      );
  }
};
