import { Hono } from "hono";
import { App } from "../client/component/App.tsx";
import dist from "./dist.json" with { type: "json" };

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <html>
      <head>
        <title>gimmick grid</title>
        <script type="module" src={`/${dist.clientCodeHash}`} />
      </head>
      <App />
    </html>,
  );
});

app.get(`/${dist.clientCodeHash}`, (c) => {
  return c.text(dist.clientCode, 200, {
    "Content-Type": "application/javascript; charset=utf-8",
  });
});

Deno.serve(app.fetch);
