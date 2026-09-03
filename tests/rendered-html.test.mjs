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
  assert.match(html, />Backtest</);
  assert.match(html, />Evidence lab</);
  assert.match(html, />Method</);

  const clientAssets = new URL("../dist/client/assets/", import.meta.url);
  const compiledClient = readdirSync(clientAssets)
    .filter((file) => file.endsWith(".js"))
    .map((file) => readFileSync(new URL(file, clientAssets), "utf8"))
    .join("\n");
  assert.match(compiledClient, /Historical promotion backtest/);
  assert.match(compiledClient, /Commander–political principal state across 14 major organizations/);
  assert.match(compiledClient, /Claims designed to be scored later/);
  assert.match(compiledClient, /The score orders visible pathways; it cannot observe the hidden veto/);
  assert.match(compiledClient, /The strongest 2036\/2041 object is often an unknown billet/);
  assert.match(compiledClient, /Output-attribution wall/);
  assert.match(compiledClient, /The argument in one page/);
  assert.match(compiledClient, /Vetting is now a selection stage/);
});

test("keeps the editorial redesign above the readability floor", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /font-size:\s*17px/);
  assert.match(css, /font-size:\s*0\.875rem\s*!important/);
  assert.match(css, /background-image:\s*none/);
  assert.match(css, /\.metric-icon\s*\{\s*display:\s*none/);
});
