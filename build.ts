import { encodeBase64Url } from "@std/encoding";

const bundler = new Deno.Command(Deno.execPath(), {
  args: ["bundle", "--minify", "./client/main.tsx"],
});

const clientCode = new TextDecoder().decode((await bundler.output()).stdout);
const clientCodeHash = encodeBase64Url(
  await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(clientCode),
  ),
);

await Deno.writeTextFile(
  "./server/dist.json",
  JSON.stringify({ clientCode, clientCodeHash }),
);
