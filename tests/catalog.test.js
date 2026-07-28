import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  enrichProduct,
  filterProducts,
  mapSearchUrl,
  sortProducts,
} from "../catalog.js";
import { rawProducts } from "../data/products.js";

test("application shell exposes the complete discovery and detail structure", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /id="searchInput"/);
  assert.match(html, /id="filterDialog"/);
  assert.match(html, /id="productDialog"/);
  assert.match(html, /id="rankingList"/);
  assert.match(html, /id="cards"/);
  assert.match(html, /aria-live="polite"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
});

test("catalog keeps the complete 91-product source set", () => {
  assert.equal(rawProducts.length, 91);
  assert.deepEqual(
    new Set(rawProducts.map((item) => item.type)),
    new Set(["cigarette", "heated", "device", "pod"]),
  );
});

test("Mevius reference price is corrected to 580 yen", () => {
  const result = enrichProduct({
    type: "cigarette",
    jp: "メビウス オリジナル",
    cn: "梅比乌斯 原味",
    jpy: 600,
  });

  assert.equal(result.jpy, 580);
  assert.equal(result.priceStatus, "official");
});

test("search matches Chinese flavor aliases", () => {
  const item = enrichProduct({
    type: "cigarette",
    jp: "メビウス メンソール",
    cn: "梅比乌斯 薄荷",
    jpy: 600,
  });

  const result = filterProducts([item], {
    query: "薄荷",
    category: "all",
    flavor: "all",
    favoritesOnly: false,
    favorites: [],
  });

  assert.equal(result.length, 1);
});

test("Japan ranking sorts descending", () => {
  const result = sortProducts(
    [
      { id: "a", jpScore: 3.5, cnScore: 4.8, jpy: 500 },
      { id: "b", jpScore: 4.7, cnScore: 3.9, jpy: 600 },
    ],
    "jp",
  );

  assert.equal(result[0].id, "b");
});

test("map URL uses the Japanese product name", () => {
  assert.match(
    mapSearchUrl({ jp: "セブンスター" }),
    /%E3%82%BB%E3%83%96%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC/,
  );
});
