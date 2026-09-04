import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, />Overview</);
  assert.match(html, />Positions</);
  assert.match(html, />Ledger</);
  assert.match(html, />Method</);

  const clientAssets = new URL("../dist/client/assets/", import.meta.url);
  const compiledClient = readdirSync(clientAssets)
    .filter((file) => file.endsWith(".js"))
    .map((file) => readFileSync(new URL(file, clientAssets), "utf8"))
    .join("\n");
  assert.match(compiledClient, /How this site is built/);
  assert.match(compiledClient, /Position coverage/);
  assert.match(compiledClient, /Disappearance clock/);
  assert.match(compiledClient, /Premise register/);
  assert.match(compiledClient, /Review log/);
  assert.match(compiledClient, /Glossary/);
});

test("keeps the editorial redesign above the readability floor", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /font-size:\s*17px/);
  assert.match(css, /font-size:\s*0\.875rem\s*!important/);
  assert.match(css, /background-image:\s*none/);
  assert.match(css, /\.metric-icon\s*\{\s*display:\s*none/);
});
