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

test("robotics route opens with research cases, evidence boundaries and sourcebook links", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);
  const response = await worker.fetch(new Request("http://localhost/robotics", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>.*?<\/script>/gis, "").replace(/<!--.*?-->/gs, "");
  const index = JSON.parse(readFileSync(new URL("../research/military-robotics/case-index.json", import.meta.url), "utf8"));
  const questions = JSON.parse(readFileSync(new URL("../research/autonomy/questions.json", import.meta.url), "utf8"));
  const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  assert.match(html, /Connect doctrine, institutions and documented systems/);
  assert.match(html, /Search research cases/);
  assert.match(html, /What to collect next/);
  assert.match(html, /Supplier relationships/);
  assert.match(html, /Legacy scorecards/);
  assert.ok(html.includes(`${index.cases.length} of ${index.cases.length} cases shown.`));
  for (const item of index.cases) {
    for (const field of ["nameEn", "nameZh", "strongestEvidence", "autonomyEvidence", "unresolved"]) {
      assert.ok(html.includes(escapeHtml(item[field])), `${item.id}: visible ${field}`);
    }
    const destination = new URL(item.dossierPath, "https://github.com/jorschneider/plaobservatory/blob/aad66f814e6da8efe7c7a26da7f2e2b9fe51f7a5/research/military-robotics/").href;
    assert.ok(html.includes(`href="${escapeHtml(destination)}"`), `${item.id}: sourcebook destination`);
  }
  for (const item of questions.questions) {
    assert.ok(html.includes(escapeHtml(item.question)), `${item.id}: visible collection question`);
  }
});
