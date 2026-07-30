import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  enrichProduct,
  filterProducts,
  mapSearchUrl,
  sortProducts,
  topDistinctBrands,
} from "../catalog.js";
import { rawProducts } from "../data/products.js";

test("application shell exposes the complete discovery and detail structure", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /id="searchInput"/);
  assert.match(html, /id="filterDialog"/);
  assert.match(html, /id="productDialog"/);
  assert.match(html, /id="rankingList"/);
  assert.match(html, /id="cards"/);
  assert.match(html, /id="mobileNearby"/);
  assert.match(html, /aria-live="polite"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
});

test("AI shell exposes text, image, Japanese card, and online fallback", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(html, /id="aiDialog"/);
  assert.match(html, /id="aiImageInput"/);
  assert.match(html, /id="onlineSearchDialog"/);
  assert.match(html, /data-ai-mode="japanese"/);
  assert.match(html, /id="onlineSearchButton"/);
  assert.match(html, /id="emptyQuery"/);
  assert.match(appSource, /if \(!item\?\.purchaseAllowed\) return null/);
});

test("public application files never contain a MiniMax secret", () => {
  for (const file of [
    "index.html",
    "app.js",
    "ai-client.js",
    "config.js",
    "worker.js",
  ]) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /sk-[A-Za-z0-9_-]{20,}/);
  }
});

test("detail header keeps favorite and close actions in a visible flex row", () => {
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.detail-header\s*>\s*div\s*\{[^}]*display:\s*flex/s);
  assert.match(styles, /\.detail-header\s+\.favorite-toggle\s*\{[^}]*position:\s*static/s);
});

test("application controller wires catalog, favorites, dialog history, and maps", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /from "\.\/data\/products\.js"/);
  assert.match(source, /localStorage/);
  assert.match(source, /showModal\(\)/);
  assert.match(source, /popstate/);
  assert.match(source, /mapSearchUrl/);
  assert.match(source, /aria-pressed/);
});

test("image maintenance scripts read the extracted product module", () => {
  const nodeScript = readFileSync(
    new URL("../scripts/download-search-images.mjs", import.meta.url),
    "utf8",
  );
  const powershellScript = readFileSync(
    new URL("../scripts/download-search-images.ps1", import.meta.url),
    "utf8",
  );

  assert.match(nodeScript, /from "\.\.\/data\/products\.js"/);
  assert.match(nodeScript, /replace\(\/\^\\uFEFF\//);
  assert.doesNotMatch(nodeScript, /Unable to locate products array in app\.js/);
  assert.match(powershellScript, /download-search-images\.mjs/);
});

test("installable shell links a manifest and registers an offline worker", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const worker = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
  const workerPath = new URL("../sw.js", import.meta.url);
  const manifestPath = new URL("../manifest.webmanifest", import.meta.url);
  const iconLibraryPath = new URL("../vendor/lucide.min.js", import.meta.url);
  const icon192Path = new URL("../icons/icon-192.png", import.meta.url);
  const icon512Path = new URL("../icons/icon-512.png", import.meta.url);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  assert.equal(existsSync(workerPath), true);
  assert.equal(existsSync(manifestPath), true);
  assert.equal(existsSync(iconLibraryPath), true);
  assert.equal(existsSync(icon192Path), true);
  assert.equal(existsSync(icon512Path), true);
  const icon192 = readFileSync(icon192Path);
  const icon512 = readFileSync(icon512Path);
  assert.deepEqual([icon192.readUInt32BE(16), icon192.readUInt32BE(20)], [192, 192]);
  assert.deepEqual([icon512.readUInt32BE(16), icon512.readUInt32BE(20)], [512, 512]);
  assert.deepEqual(
    manifest.icons.map((icon) => icon.sizes),
    ["192x192", "512x512"],
  );
  assert.match(html, /rel="manifest"\s+href="\.\/manifest\.webmanifest"/);
  assert.match(html, /src="\.\/vendor\/lucide\.min\.js"/);
  assert.match(source, /navigator\.serviceWorker\.register\("\.\/sw\.js"\)/);
  assert.match(worker, /"\.\/vendor\/lucide\.min\.js"/);
});

test("catalog keeps the expanded 146-product source set", () => {
  assert.equal(rawProducts.length, 146);
  assert.deepEqual(
    new Set(rawProducts.map((item) => item.type)),
    new Set(["cigarette", "heated", "device", "pod"]),
  );
});

test("Cigaronne has a dedicated brand category with the full World Tobacco series", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const products = rawProducts.map((item) => enrichProduct(item));
  const cigaronne = filterProducts(products, {
    category: "brand:cigaronne",
  });

  assert.match(html, /data-category="brand:cigaronne"/);
  assert.match(html, />卡比龙全系列</);
  assert.equal(cigaronne.length, 11);
  assert.deepEqual(
    cigaronne.map((item) => item.jp).sort((a, b) => a.localeCompare(b, "ja")),
    [
      "シガローネ・エクスクルーシブ・ブラウン",
      "シガローネ・スーパースリム・ブラック",
      "シガローネ・スーパースリム・メンソール",
      "シガローネ・タトゥー・チェリー",
      "シガローネ・タトゥー・チョコレート",
      "シガローネ・タトゥー・バニラ",
      "シガローネ・ファントム・シルバー",
      "シガローネ・マグネット",
      "シガローネ・ロイヤルスリム・ブラック",
      "シガローネ・ロイヤルスリム・メンソール",
      "シガローネ・ウルトラスリム・ブラック",
    ].sort((a, b) => a.localeCompare(b, "ja")),
  );
  assert.ok(cigaronne.every((item) => item.type === "cigarette"));
  assert.ok(cigaronne.every((item) => item.brand === "Cigaronne"));
});

test("device catalog covers mainstream heated and vapor hardware families", () => {
  const devices = rawProducts.filter((item) => item.type === "device");
  const deviceNames = devices.map((item) => `${item.jp} ${item.cn}`).join("\n");

  assert.equal(devices.length >= 24, true);
  for (const family of [
    /IQOS ILUMA i PRIME/i,
    /IQOS ILUMA i ONE/i,
    /Ploom AURA/i,
    /Ploom X ADVANCED/i,
    /glo HYPER pro\+/i,
    /glo HYPER pro/i,
    /glo HYPER air/i,
    /glo Hilo/i,
    /lil HYBRID 3\.0/i,
    /RELX Infinity/i,
    /VAPORESSO XROS 5/i,
    /VAPORESSO XROS 4/i,
    /Uwell Caliburn G4/i,
    /Voopoo Argus G3/i,
    /OXVA XLIM SQ Pro 2/i,
  ]) {
    assert.match(deviceNames, family);
  }
});

test("public config supports a runtime AI proxy URL without storing secrets", () => {
  const config = readFileSync(new URL("../config.js", import.meta.url), "utf8");
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const workflowPath = new URL("../.github/workflows/deploy-ai-worker.yml", import.meta.url);
  const localProxyPath = new URL("../scripts/local-ai-proxy.mjs", import.meta.url);
  const startupScriptPath = new URL("../scripts/start-local-ai-proxy.ps1", import.meta.url);

  assert.match(config, /TABAKO_AI_PROXY_URL/);
  assert.match(config, /URLSearchParams/);
  assert.match(config, /tabako\.tail74d566\.ts\.net\/tabako-ai/);
  assert.equal(packageJson.scripts["ai:local"], "node scripts/local-ai-proxy.mjs");
  assert.equal(existsSync(workflowPath), true);
  assert.equal(existsSync(localProxyPath), true);
  assert.equal(existsSync(startupScriptPath), true);
});

test("device sorting groups by brand and then machine generation", () => {
  const sorted = sortProducts(
    [
      enrichProduct({ type: "device", jp: "glo HYPER pro", cn: "glo HYPER pro", jpy: 3980 }),
      enrichProduct({ type: "device", jp: "IQOS イルマ i ワン", cn: "IQOS ILUMA i ONE", jpy: 3980 }),
      enrichProduct({ type: "device", jp: "Ploom X ADVANCED", cn: "Ploom X ADVANCED", jpy: 1980 }),
      enrichProduct({ type: "device", jp: "IQOS イルマ i プライム", cn: "IQOS ILUMA i PRIME", jpy: 9980 }),
      enrichProduct({ type: "device", jp: "glo HYPER air", cn: "glo HYPER air", jpy: 1980 }),
      enrichProduct({ type: "device", jp: "VAPORESSO XROS 4", cn: "VAPORESSO XROS 4 主机", jpy: 4200 }),
      enrichProduct({ type: "device", jp: "VAPORESSO XROS 5", cn: "VAPORESSO XROS 5 主机", jpy: 5200 }),
    ],
    "device",
  );

  assert.deepEqual(
    sorted.map((item) => item.cn),
    [
      "IQOS ILUMA i PRIME",
      "IQOS ILUMA i ONE",
      "Ploom X ADVANCED",
      "glo HYPER pro",
      "glo HYPER air",
      "VAPORESSO XROS 5 主机",
      "VAPORESSO XROS 4 主机",
    ],
  );
});

test("pod sorting keeps brand families together and orders cartridge resistance logically", () => {
  const sorted = sortProducts(
    [
      enrichProduct({ type: "pod", jp: "Uwell Caliburn G3 ポッド 1.2Ω", cn: "Uwell Caliburn G3 烟弹 1.2Ω", jpy: 1400 }),
      enrichProduct({ type: "pod", jp: "VAPORESSO XROS メッシュポッド 1.0Ω", cn: "VAPORESSO XROS 网芯烟弹 1.0Ω", jpy: 1500 }),
      enrichProduct({ type: "pod", jp: "VAPORESSO XROS メッシュポッド 0.6Ω", cn: "VAPORESSO XROS 网芯烟弹 0.6Ω", jpy: 1500 }),
      enrichProduct({ type: "pod", jp: "Uwell Caliburn G3 ポッド 0.6Ω", cn: "Uwell Caliburn G3 烟弹 0.6Ω", jpy: 1400 }),
    ],
    "device",
  );

  assert.deepEqual(
    sorted.map((item) => item.cn),
    [
      "VAPORESSO XROS 网芯烟弹 0.6Ω",
      "VAPORESSO XROS 网芯烟弹 1.0Ω",
      "Uwell Caliburn G3 烟弹 0.6Ω",
      "Uwell Caliburn G3 烟弹 1.2Ω",
    ],
  );
});

test("recommended sorting groups every catalog type by brand before individual ranking", () => {
  const products = rawProducts.map((item, index) => enrichProduct(item, index));
  const sorted = sortProducts(products, "recommended");
  const brandRanges = new Map();

  sorted.forEach((item, index) => {
    const range = brandRanges.get(item.brand) ?? { first: index, last: index };
    range.last = index;
    brandRanges.set(item.brand, range);
  });

  for (const [brand, range] of brandRanges) {
    const brandsInside = new Set(sorted.slice(range.first, range.last + 1).map((item) => item.brand));
    assert.deepEqual([...brandsInside], [brand]);
  }

  const devices = sorted.filter((item) => item.type === "device");
  assert.deepEqual(
    [...new Set(devices.map((item) => item.brand))].slice(0, 4),
    ["IQOS", "Ploom", "glo", "lil HYBRID"],
  );

  const pods = sorted.filter((item) => item.type === "pod");
  assert.deepEqual(
    [...new Set(pods.map((item) => item.brand))],
    ["RELX", "MOTI", "VAPORESSO", "Uwell", "Voopoo", "ELFBAR"],
  );
});

test("catalog renderer inserts visible brand section headers", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(source, /brand-section-card/);
  assert.match(source, /按品牌归组/);
  assert.equal(source.includes("const brandKey = `${item.type}:${item.brand}`;"), true);
  assert.match(styles, /\.brand-section-card\s*\{/);
  assert.match(styles, /grid-column:\s*1\s*\/\s*-1/);
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

test("ranking preview keeps one leading product per brand", () => {
  const result = topDistinctBrands(
    [
      { id: "m1", brand: "Mevius", jpScore: 5 },
      { id: "m2", brand: "Mevius", jpScore: 4.9 },
      { id: "s1", brand: "Seven Stars", jpScore: 4.8 },
    ],
    "jp",
    6,
  );

  assert.deepEqual(result.map((item) => item.id), ["m1", "s1"]);
});

test("variants inherit transparent brand-level popularity instead of name-hash scores", () => {
  const original = enrichProduct({
    type: "cigarette",
    jp: "メビウス オリジナル",
    cn: "梅比乌斯 原味",
    jpy: 600,
  });
  const menthol = enrichProduct({
    type: "cigarette",
    jp: "メビウス メンソール",
    cn: "梅比乌斯 薄荷",
    jpy: 600,
  });

  assert.deepEqual(
    [original.jpScore, original.cnScore],
    [menthol.jpScore, menthol.cnScore],
  );
});

test("map URL uses the Japanese product name", () => {
  assert.match(
    mapSearchUrl({ jp: "セブンスター" }),
    /%E3%82%BB%E3%83%96%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC/,
  );
});

test("category filter keeps TEREA in heated products", () => {
  const item = enrichProduct({
    type: "heated",
    jp: "IQOS テリア レギュラー",
    cn: "IQOS TEREA 经典",
    jpy: 580,
  });

  assert.equal(
    filterProducts([item], {
      category: "heated",
      flavor: "all",
      favorites: [],
    }).length,
    1,
  );
});

test("menthol filter matches Japanese menthol names", () => {
  const item = enrichProduct({
    type: "heated",
    jp: "IQOS テリア ブラックメンソール",
    cn: "IQOS TEREA 黑薄荷",
    jpy: 580,
  });

  assert.equal(
    filterProducts([item], {
      category: "all",
      flavor: "menthol",
      favorites: [],
    }).length,
    1,
  );
});

test("favorites-only filter accepts a Set of IDs", () => {
  const first = enrichProduct({ type: "cigarette", jp: "A", cn: "甲", jpy: 500 });
  const second = enrichProduct({ type: "cigarette", jp: "B", cn: "乙", jpy: 500 });

  const result = filterProducts([first, second], {
    category: "all",
    flavor: "all",
    favoritesOnly: true,
    favorites: new Set([second.id]),
  });

  assert.deepEqual(result.map((item) => item.id), [second.id]);
});

test("legacy cigarettes are marked discontinued instead of pretending live stock", () => {
  const result = enrichProduct({
    type: "cigarette",
    jp: "わかば",
    cn: "若叶",
    jpy: 250,
  });

  assert.equal(result.availability, "discontinued");
});

test("electronic pods with unknown nicotine status do not expose purchase guidance", () => {
  const result = enrichProduct({
    type: "pod",
    jp: "RELX Infinity ミント ポッド",
    cn: "RELX 无限 薄荷烟弹",
    jpy: 980,
  });

  assert.equal(result.availability, "restricted");
  assert.equal(result.purchaseAllowed, false);
  assert.match(result.source, /mhlw\.go\.jp/);
});

test("official reference prices always expose an official source", () => {
  const americanSpirit = enrichProduct({
    type: "cigarette",
    jp: "ナチュラル アメリカン スピリット",
    cn: "美式精神",
    jpy: 640,
  });
  const lil = enrichProduct({
    type: "heated",
    jp: "lil HYBRID ミックス レギュラー",
    cn: "lil HYBRID 混合经典",
    jpy: 520,
  });

  assert.equal(americanSpirit.priceStatus, "official");
  assert.match(americanSpirit.source, /jti\.co\.jp/);
  assert.equal(lil.priceStatus, "official");
  assert.match(lil.source, /iqos\.com/);
});

test("generic map URL searches for a tobacco seller", () => {
  assert.match(mapSearchUrl(), /%E3%81%9F%E3%81%B0%E3%81%93%20%E8%B2%A9%E5%A3%B2%E5%BA%97/);
});
