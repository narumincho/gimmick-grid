import type { Item } from "../grid.ts";

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
            items={items.filter((item) => item.floor === floorIndex)}
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

const Item = ({ item }: { readonly item: Item }) => {
  switch (item.type) {
    case "player":
      return <circle cx={item.x + 0.5} cy={item.y + 0.5} r={0.4} />;
    case "wall": {
      switch (item.direction) {
        case "horizontal":
          return (
            <line
              x1={item.x}
              y1={item.y}
              x2={item.x + 1}
              y2={item.y}
              stroke="black"
              strokeWidth={0.1}
            />
          );

        case "vertical":
          return (
            <line
              x1={item.x}
              y1={item.y}
              x2={item.x}
              y2={item.y + 1}
              stroke="black"
              strokeWidth={0.1}
            />
          );
      }
    }
  }
};
