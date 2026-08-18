import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the 모두나들이 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>모두나들이 \| 모두에게 맞는 문화활동 찾기<\/title>/i);
  assert.match(html, /나들이 조건을 알려주세요/);
  assert.match(html, /조건에 맞는 활동/);
  assert.match(html, /후보 비교/);
  assert.match(html, /활동계획표/);
});

test("keeps every prototype workflow connected", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const marker of [
    "timeRanges",
    "partyTotal",
    "toggleCompare",
    "addPlan",
    "sharePlan",
    "saveFacility",
    "alertsEnabled",
    "modu-nadeuri-state-v2",
    "activityMedia",
    "홈페이지 확인하기",
  ]) assert.match(page, new RegExp(marker));

  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(page, /defaultChecked/);

  const photo = await stat(new URL("../public/activities/activity-photo-grid.png", import.meta.url));
  assert.ok(photo.size > 100_000);
});
