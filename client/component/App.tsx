import { useState } from "hono/jsx";

export const App = () => {
  const [value, setValue] = useState(0);
  return (
    <html>
      <head>
      </head>
      <body>
        最初の表示: {value}

        <button
          type="button"
          onClick={() => {
            setValue((prev) => prev + 1);
          }}
        >
          +
        </button>
      </body>
    </html>
  );
};
