# Tabako AI Concierge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an image-first product catalog, resilient zero-result recovery, and a secure MiniMax-powered AI concierge while preserving the current GitHub Pages URL and all existing product safeguards.

**Architecture:** Keep the public site framework-free. Add pure browser-safe AI/search helpers in `ai-client.js`, an optional public proxy URL in `config.js`, and a standalone Cloudflare Worker template in `worker.js` that owns the MiniMax secret. The UI always provides local recommendations, external search links, and an offline Japanese cashier card; network AI enhances those paths only when a proxy is configured.

**Tech Stack:** Static HTML, CSS, JavaScript modules, Node built-in test runner, Cloudflare Worker-compatible Fetch API, MiniMax OpenAI-compatible Chat Completions API, MiniMax Anthropic-compatible Messages API server tools, GitHub Pages.

---

## File map

- `ai-client.js`: input limits, external-search URLs, offline recommendation scoring, proxy requests, normalized AI results, and cashier-card text.
- `config.js`: public runtime configuration containing only an optional proxy URL.
- `worker.js`: serverless proxy request validation, CORS, MiniMax request construction, response normalization, and error handling.
- `index.html`: AI entry point, zero-result recovery actions, AI dialog, search-results dialog, and updated card template.
- `app.js`: AI dialog state, file preview, local fallback, proxy calls, search result rendering, and product-card/detail integrations.
- `styles.css`: image-first cards, AI task sheet, result cards, image preview, Japanese card, and responsive layout.
- `tests/ai-client.test.js`: pure helper and client tests.
- `tests/worker.test.js`: proxy contract tests with a mocked upstream fetch.
- `tests/catalog.test.js`: structural regression tests for the new interface and secret-safety assertions.
- `README.md`: AI behavior, privacy, deployment, and key-rotation instructions.
- `sw.js`: cache the new public modules without caching user AI responses.

### Task 1: Lock the browser/client contracts with failing tests

**Files:**
- Create: `tests/ai-client.test.js`
- Modify: `tests/catalog.test.js`

- [ ] **Step 1: Add tests for resilient local behavior**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildExternalSearchLinks,
  buildJapaneseRequest,
  createAiClient,
  localRecommend,
} from "../ai-client.js";

test("external search links preserve and encode the exact query", () => {
  const links = buildExternalSearchLinks("蓝色 七星");
  assert.match(links.images, /%E8%93%9D%E8%89%B2/);
  assert.match(links.official, /site%3Ajti\.co\.jp/);
});

test("Japanese request card works without a network", () => {
  assert.equal(
    buildJapaneseRequest("セブンスター"),
    "「セブンスター」はありますか？ 一箱お願いします。",
  );
});

test("local recommendation returns catalog IDs", () => {
  const matches = localRecommend("清凉 薄荷", [
    { id: "regular", searchText: "原味", flavor: "tobacco", jpScore: 4 },
    { id: "menthol", searchText: "薄荷 清凉", flavor: "menthol", jpScore: 4.5 },
  ]);
  assert.equal(matches[0].id, "menthol");
});

test("unconfigured AI client reports offline without fetching", async () => {
  let called = false;
  const client = createAiClient({ endpoint: "", fetchImpl: async () => { called = true; } });
  assert.equal(client.configured, false);
  await assert.rejects(client.ask({ mode: "recommend", query: "七星" }), /未配置/);
  assert.equal(called, false);
});
```

- [ ] **Step 2: Add structural and secret-safety assertions**

```js
test("AI shell exposes text, image, Japanese card, and online fallback", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /id="aiDialog"/);
  assert.match(html, /id="aiImageInput"/);
  assert.match(html, /id="onlineSearchDialog"/);
  assert.match(html, /data-ai-mode="japanese"/);
});

test("public repository files never contain a MiniMax secret", () => {
  for (const file of ["index.html", "app.js", "ai-client.js", "config.js", "worker.js"]) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /sk-[A-Za-z0-9_-]{20,}/);
  }
});
```

- [ ] **Step 3: Run the tests and verify red**

Run: `node --test tests/ai-client.test.js tests/catalog.test.js`
Expected: FAIL because `ai-client.js` and the new interface elements do not exist.

### Task 2: Implement the pure AI client and offline fallbacks

**Files:**
- Create: `ai-client.js`
- Create: `config.js`
- Test: `tests/ai-client.test.js`

- [ ] **Step 1: Implement public helpers and bounded proxy calls**

Implement:

```js
export const AI_LIMITS = {
  query: 240,
  imageBytes: 4 * 1024 * 1024,
  catalogItems: 120,
};

export function buildJapaneseRequest(jpName, quantity = "一箱") {
  return `「${String(jpName).trim()}」はありますか？ ${quantity}お願いします。`;
}

export function buildExternalSearchLinks(query) {
  const phrase = `${String(query).trim()} 日本 たばこ`;
  return {
    images: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(phrase)}`,
    web: `https://www.google.com/search?q=${encodeURIComponent(phrase)}`,
    official: `https://www.google.com/search?q=${encodeURIComponent(`site:jti.co.jp ${phrase}`)}`,
  };
}
```

`localRecommend()` must tokenize Chinese/Japanese/Latin text, score `searchText`, `flavor`, `strength`, `brand`, price hints, and popularity, then return the three strongest items with deterministic reasons. `createAiClient()` must validate mode, query length, image size, timeout after 25 seconds, send JSON only to the configured proxy, and accept only a normalized `{ answer, matches, sources }` response.

- [ ] **Step 2: Add safe public runtime configuration**

```js
window.TABAKO_CONFIG = Object.freeze({
  aiProxyUrl: "",
});
```

- [ ] **Step 3: Run the helper tests**

Run: `node --test tests/ai-client.test.js`
Expected: PASS.

### Task 3: Lock and implement the secure MiniMax proxy

**Files:**
- Create: `tests/worker.test.js`
- Create: `worker.js`
- Create: `wrangler.toml.example`

- [ ] **Step 1: Write failing proxy tests**

Test that the worker:

- rejects origins other than `https://niuzipai-gif.github.io`;
- returns 503 when `MINIMAX_API_KEY` is absent;
- rejects unsupported modes and oversized bodies;
- sends recommendation and vision modes to `https://api.minimaxi.com/v1/chat/completions`;
- sends web search to `https://api.minimaxi.com/anthropic/v1/messages` with `web_search_20250305`;
- returns normalized JSON without upstream reasoning blocks or credentials.

- [ ] **Step 2: Run the proxy tests and verify red**

Run: `node --test tests/worker.test.js`
Expected: FAIL because `worker.js` does not exist.

- [ ] **Step 3: Implement the Fetch handler**

Export `createWorker({ fetchImpl = fetch })` for tests and a default `{ fetch(request, env) }` worker. Validate `Content-Type`, `Content-Length`, origin, method, mode, query length, catalog length, and image data URL media type. Read the key only from `env.MINIMAX_API_KEY`. Return CORS headers only for the allow-listed origin. Use `MiniMax-M3`, non-streaming responses, bounded completion tokens, and JSON-only prompts.

- [ ] **Step 4: Run proxy tests**

Run: `node --test tests/worker.test.js`
Expected: PASS.

### Task 4: Build the image-first and AI interface

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `sw.js`
- Test: `tests/catalog.test.js`

- [ ] **Step 1: Add the semantic UI**

Add:

- an `AI 找烟` button next to the search controls;
- a richer zero-result state with the exact query, AI/web search, Google Images, and JT-site links;
- one AI dialog with text, image, and Japanese-card tabs;
- one online-search results dialog;
- a 4:5 image stage in the product template;
- an `AI 日语沟通卡` action in permitted product details.

- [ ] **Step 2: Wire resilient behavior**

In `app.js`, initialize `createAiClient()` with `window.TABAKO_CONFIG.aiProxyUrl`. Use local recommendations immediately, then replace/enrich them with proxy results when configured. Preserve selected product state between the catalog, detail, and Japanese card. Revoke object URLs after image changes or dialog close. Render all model text through `textContent`, never `innerHTML`.

- [ ] **Step 3: Apply the visual system**

Use a two-column mobile grid, three/four columns at wider breakpoints, generous portrait image stages, progressive card metadata, spring-like sheet motion, visible focus rings, and transform/opacity transitions. Keep 44 px touch targets and reduced-motion support.

- [ ] **Step 4: Update the service worker**

Cache `ai-client.js` and `config.js`. Do not cache proxy requests, uploaded images, AI prompts, or AI responses.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: all legacy and new tests pass.

### Task 5: Document, visually verify, and publish

**Files:**
- Modify: `README.md`
- Create: `docs/qa/ai-redesign-mobile.png`
- Create: `docs/qa/ai-redesign-mobile-detail.png`
- Create: `docs/qa/ai-redesign-desktop.png`

- [ ] **Step 1: Document deployment and privacy**

Explain that the public configuration contains only a proxy URL; deploy `worker.js` to a serverless runtime; store a newly rotated key as `MINIMAX_API_KEY`; restrict `ALLOWED_ORIGIN`; then set `aiProxyUrl` in `config.js`. State that the key shared in chat must be revoked.

- [ ] **Step 2: Run automated verification**

Run:

```powershell
npm test
rg -n "sk-[A-Za-z0-9_-]{20,}" . --glob "!vendor/**" --glob "!images/**" --glob "!docs/qa/**"
git diff --check
```

Expected: tests pass, key scan returns no matches, and diff check returns no errors.

- [ ] **Step 3: Verify mobile and desktop visually**

At 390 × 844, compare the production-source screenshot and the prototype together. Verify image containment, first-screen hierarchy, empty search, online fallback, AI tabs, image preview, Japanese card, detail open/close, and no horizontal overflow. At 1440 × 1000, verify card density and the right-side detail panel.

- [ ] **Step 4: Publish to the original URL**

Commit the intentional files, push `codex/tabako-ai-concierge`, fast-forward `main`, push `main`, wait for the GitHub Pages workflow, and verify `https://niuzipai-gif.github.io/tabako/` on mobile and desktop. Do not claim the MiniMax network path is live until a rotated server-side key and proxy URL are configured.
