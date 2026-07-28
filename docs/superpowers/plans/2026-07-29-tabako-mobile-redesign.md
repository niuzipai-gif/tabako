# Tabako Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat 91-item price list with a mobile-first bilingual tobacco discovery tool that offers rich details, honest price/stock/score boundaries, rankings, favorites, and Google Maps handoff while preserving the existing GitHub Pages URL.

**Architecture:** Keep the project framework-free and split responsibilities into a catalog data module, pure filtering/enrichment functions, DOM interaction code, and responsive CSS. Product detail is one reusable dialog rendered as a bottom sheet on mobile and side panel on desktop. GitHub Pages continues to deploy the repository root.

**Tech Stack:** Semantic HTML, CSS custom properties, vanilla ES modules, Node's built-in test runner, Lucide icon library, GitHub Actions/Pages.

---

## File map

- `index.html`: semantic application shell, discovery controls, result containers, detail dialog, and templates.
- `styles.css`: design tokens, mobile-first layouts, motion, focus states, bottom sheet, and desktop enhancement.
- `data/products.js`: original catalog plus curated authoritative corrections and product-level overrides.
- `catalog.js`: pure catalog enrichment, search, filtering, ranking, formatting, and map URL functions.
- `app.js`: DOM rendering, state, dialog history/focus behavior, favorites, exchange rate, and service-worker registration.
- `tests/catalog.test.js`: pure-function regression coverage.
- `manifest.webmanifest`: install metadata.
- `sw.js`: cache-first local shell and stale-while-revalidate navigation.
- `README.md`: user-facing data-boundary and maintenance documentation.

### Task 1: Extract and enrich the catalog

**Files:**
- Create: `data/products.js`
- Create: `catalog.js`
- Create: `tests/catalog.test.js`
- Modify: `app.js`

- [ ] **Step 1: Write failing tests for filter, sort, enrichment, and map URLs**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  enrichProduct,
  filterProducts,
  mapSearchUrl,
  sortProducts,
} from "../catalog.js";

test("Mevius reference price is corrected to 580 yen", () => {
  assert.equal(enrichProduct({ type: "cigarette", jp: "メビウス", cn: "梅比乌斯", jpy: 600 }).jpy, 580);
});

test("search matches Chinese and flavor aliases", () => {
  const item = enrichProduct({ type: "cigarette", jp: "メビウス メンソール", cn: "梅比乌斯 薄荷", jpy: 600 });
  assert.equal(filterProducts([item], { query: "薄荷", category: "all", flavor: "all", favorites: [] }).length, 1);
});

test("Japan ranking sorts descending", () => {
  const result = sortProducts([{ jpScore: 3.5 }, { jpScore: 4.7 }], "jp");
  assert.equal(result[0].jpScore, 4.7);
});

test("map URL uses the Japanese product name", () => {
  assert.match(mapSearchUrl({ jp: "セブンスター" }), /%E3%82%BB%E3%83%96%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC/);
});
```

- [ ] **Step 2: Run the test and verify the module is missing**

Run: `node --test tests/catalog.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Add catalog data and pure functions**

Implement `enrichProduct(product, index)`, `filterProducts(products, filters)`, `sortProducts(products, sort)`, `mapSearchUrl(product)`, `yen(value)`, and `yuan(value, rate)` in `catalog.js`. Move the existing `products` array to `data/products.js`. Use manufacturer/brand rules for descriptions, scores, availability, flavor, strength, and the 2026 price corrections defined in the design spec.

- [ ] **Step 4: Run the tests**

Run: `node --test tests/catalog.test.js`  
Expected: all catalog tests PASS.

- [ ] **Step 5: Commit the data foundation**

```powershell
git add data/products.js catalog.js tests/catalog.test.js app.js
git commit -m "feat: add enriched tobacco catalog"
```

### Task 2: Build the mobile-first application shell

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Add a structural smoke test**

Extend `tests/catalog.test.js` to read `index.html` and assert that it contains `#searchInput`, `#filterDialog`, `#productDialog`, `#rankingList`, `#cards`, an `aria-live` summary, and one `<h1>`.

- [ ] **Step 2: Run the smoke test and verify it fails**

Run: `node --test tests/catalog.test.js`  
Expected: FAIL because the new dialogs and ranking list do not exist.

- [ ] **Step 3: Replace the page shell**

Create:

```html
<header class="app-header">
  <a class="brand" href="#top" aria-label="烟草罗盘首页">煙草羅盤 <span>Tabako Compass</span></a>
  <button class="icon-button" id="favoritesButton" type="button" aria-label="只看收藏"></button>
</header>
<main id="mainContent">
  <section class="intro" aria-labelledby="pageTitle"></section>
  <section class="discovery-panel" aria-label="搜索与筛选"></section>
  <section id="rankings" aria-labelledby="rankingTitle"></section>
  <section id="catalog" aria-labelledby="catalogTitle"></section>
</main>
<dialog id="filterDialog"></dialog>
<dialog id="productDialog"></dialog>
```

Use buttons for interactive rows, labels for all controls, `aria-live="polite"` on the result summary, and a visible 20+ health/reference notice.

- [ ] **Step 4: Implement the visual system**

Add warm neutral tokens, 44px targets, sticky discovery controls, list rows with product pack aspect-ratio containment, bottom-sheet dialog, desktop side-panel breakpoint, press/focus states, and `prefers-reduced-motion`.

- [ ] **Step 5: Run the smoke test**

Run: `node --test tests/catalog.test.js`  
Expected: all tests PASS.

- [ ] **Step 6: Commit the application shell**

```powershell
git add index.html styles.css tests/catalog.test.js
git commit -m "feat: redesign Tabako discovery experience"
```

### Task 3: Implement catalog, ranking, favorites, and detail interactions

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/catalog.test.js`

- [ ] **Step 1: Add failing behavior tests for category, flavor, favorites, and discontinued availability**

Add tests that:

- filter a TEREA product into `heated`;
- filter menthol aliases into `menthol`;
- keep only favorite IDs;
- classify a discontinued product as `discontinued`;
- produce a generic tobacco-shop URL when no product is supplied.

- [ ] **Step 2: Run tests and verify failures**

Run: `node --test tests/catalog.test.js`  
Expected: new assertions FAIL.

- [ ] **Step 3: Implement state and rendering**

Use a single state object:

```js
const state = {
  query: "",
  category: "all",
  flavor: "all",
  sort: "recommended",
  rankingAudience: "jp",
  favoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("tabako:favorites") || "[]")),
  activeProductId: null,
};
```

Render rankings and results from the same filtered catalog. Preserve the visible result count, empty state, and product image error state.

- [ ] **Step 4: Implement the detail dialog**

Populate price, conversion timestamp, flavor profile, strength, compatibility, estimated availability, dual popularity scores, paraphrased audience impressions, seller types, official source link, and two Google Maps actions. Push a history state on open; close on Back, Escape, backdrop, or close button; restore focus to the trigger.

- [ ] **Step 5: Implement favorites and filters**

Persist favorite IDs under `tabako:favorites`. Ensure the favorite button stops event propagation. Make filter chips and select controls update the same render pipeline.

- [ ] **Step 6: Run tests**

Run: `node --test tests/catalog.test.js`  
Expected: all tests PASS.

- [ ] **Step 7: Commit interactions**

```powershell
git add app.js index.html styles.css tests/catalog.test.js
git commit -m "feat: add product details rankings and maps"
```

### Task 4: Add resilient loading and documentation

**Files:**
- Create: `manifest.webmanifest`
- Create: `sw.js`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `README.md`

- [ ] **Step 1: Add failing asset-reference tests**

Assert that `index.html` links the manifest, `app.js` registers `./sw.js`, and the service worker includes `./index.html`, `./styles.css`, `./app.js`, `./catalog.js`, and `./data/products.js`.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/catalog.test.js`  
Expected: FAIL because PWA files are absent.

- [ ] **Step 3: Add the manifest and service worker**

Use a versioned cache name, pre-cache only the local shell, return cached local images immediately, and use network-first navigation so deployments are not hidden by stale HTML.

- [ ] **Step 4: Document data boundaries and maintenance**

Explain the difference between reference price, exchange conversion, estimated availability, editorial popularity, and common-impression paraphrases. Link the official sources used for 2026 corrections.

- [ ] **Step 5: Run tests**

Run: `node --test tests/catalog.test.js`  
Expected: all tests PASS.

- [ ] **Step 6: Commit resilience work**

```powershell
git add manifest.webmanifest sw.js index.html app.js README.md tests/catalog.test.js
git commit -m "feat: add offline-ready resilient shell"
```

### Task 5: Visual verification and GitHub Pages deployment

**Files:**
- Modify only if verification finds defects.

- [ ] **Step 1: Run the complete automated check**

Run: `node --test`  
Expected: all tests PASS.

- [ ] **Step 2: Start a local server**

Run: `python -m http.server 4173`  
Expected: server listens on `http://127.0.0.1:4173`.

- [ ] **Step 3: Verify mobile**

At 390 × 844, verify search, chips, rankings, favorites, detail open/close, Back, map URL, no horizontal overflow, and reduced-motion CSS. Save accepted screenshots under `docs/qa/`.

- [ ] **Step 4: Verify desktop**

At 1440 × 1000, verify the two-column catalog and right-side detail panel. Save the accepted screenshot under `docs/qa/`.

- [ ] **Step 5: Inspect git scope**

Run: `git status -sb` and `git diff --check`.  
Expected: only intentional Tabako files and no whitespace errors.

- [ ] **Step 6: Push, merge, and verify production**

Push `codex/tabako-mobile-redesign`, merge it into `main`, push `main`, watch the Pages workflow, and open `https://niuzipai-gif.github.io/tabako/` at a mobile viewport. The production title, result summary, product detail, and Google Maps link must match the new build.
