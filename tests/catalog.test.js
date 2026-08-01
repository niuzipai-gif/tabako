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

test("mobile first screen emphasizes search, filters, AI, and ranking without crowding maps", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(html, /class="[^"]*\bprimary-mobile-actions\b[^"]*"/);
  assert.match(html, /class="ranking-quick-link"/);
  assert.match(html, /完整排行/);
  assert.match(html, /class="mobile-nearby is-subtle"/);
  assert.match(styles, /\.primary-mobile-actions\s*\{/);
  assert.match(styles, /\.ranking-quick-link\s*\{/);
  assert.match(styles, /\.mobile-nearby\.is-subtle\s*\{/);
  assert.match(styles, /@media\s*\(max-width:\s*720px\)[\s\S]*\.ranking-section\s*\{[\s\S]*margin-top:\s*10px/);
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

test("catalog keeps the expanded product source set open to new verified additions", () => {
  assert.equal(rawProducts.length >= 163, true);
  assert.deepEqual(
    new Set(rawProducts.map((item) => item.type)),
    new Set(["cigarette", "heated", "device", "pod"]),
  );
});

test("American Spirit variants stay grouped by brand before generic fallback sorting", () => {
  const products = rawProducts.map((item, index) => enrichProduct(item, index));
  const americanSpirit = sortProducts(
    products.filter((item) => item.brand === "American Spirit"),
    "recommended",
  );

  assert.deepEqual(
    americanSpirit.map((item) => item.jp),
    [
      "ナチュラル アメリカン スピリット",
      "ナチュラル アメリカン スピリット ライト 14本入",
      "アメリカン スピリット ターコイズ",
    ],
  );
});

test("Cigaronne has a dedicated brand category with the full official series", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const products = rawProducts.map((item) => enrichProduct(item));
  const cigaronne = filterProducts(products, {
    category: "brand:cigaronne",
  });

  assert.match(html, /data-category="brand:cigaronne"/);
  assert.match(html, />卡比龙全系列</);
  assert.equal(cigaronne.length, 24);
  assert.deepEqual(
    cigaronne.map((item) => item.jp).sort((a, b) => a.localeCompare(b, "ja")),
    [
      "シガローネ・クラシック・ウルトラスリム",
      "シガローネ・クラシック・キングサイズ",
      "シガローネ・クラシック・コンパット",
      "シガローネ・クラシック・スーパースリム",
      "シガローネ・エクスクルーシブ・ブラウン",
      "シガローネ・センター・ウルトラスリム",
      "シガローネ・センター・キングサイズ",
      "シガローネ・センター・コンパット",
      "シガローネ・センター・スーパースリム",
      "シガローネ・スーパースリム・ブラック",
      "シガローネ・スーパースリム・メンソール",
      "シガローネ・スーパースリム・ホワイト",
      "シガローネ・タトゥー・チェリー",
      "シガローネ・タトゥー・チョコレート",
      "シガローネ・タトゥー・バニラ",
      "シガローネ・ビッグボス",
      "シガローネ・ファントム",
      "シガローネ・ファントム・シルバー",
      "シガローネ・マグネット",
      "シガローネ・レジェンド",
      "シガローネ・ロイヤルスリム・ブラック",
      "シガローネ・ロイヤルスリム・メンソール",
      "シガローネ・ロイヤルスリム・ホワイト",
      "シガローネ・ウルトラスリム・ブラック",
    ].sort((a, b) => a.localeCompare(b, "ja")),
  );
  assert.ok(cigaronne.every((item) => item.type === "cigarette"));
  assert.ok(cigaronne.every((item) => item.brand === "Cigaronne"));
});

test("Cigaronne brand page follows a stable series order", () => {
  const products = rawProducts.map((item, index) => enrichProduct(item, index));
  const cigaronne = sortProducts(
    filterProducts(products, {
      category: "brand:cigaronne",
    }),
    "recommended",
  );

  assert.deepEqual(
    cigaronne.map((item) => item.jp),
    [
      "シガローネ・レジェンド",
      "シガローネ・ビッグボス",
      "シガローネ・ロイヤルスリム・ブラック",
      "シガローネ・ロイヤルスリム・ホワイト",
      "シガローネ・ロイヤルスリム・メンソール",
      "シガローネ・ファントム",
      "シガローネ・ファントム・シルバー",
      "シガローネ・エクスクルーシブ・ブラウン",
      "シガローネ・クラシック・キングサイズ",
      "シガローネ・クラシック・コンパット",
      "シガローネ・クラシック・ウルトラスリム",
      "シガローネ・クラシック・スーパースリム",
      "シガローネ・スーパースリム・ブラック",
      "シガローネ・スーパースリム・メンソール",
      "シガローネ・スーパースリム・ホワイト",
      "シガローネ・ウルトラスリム・ブラック",
      "シガローネ・タトゥー・チェリー",
      "シガローネ・タトゥー・チョコレート",
      "シガローネ・タトゥー・バニラ",
      "シガローネ・センター・キングサイズ",
      "シガローネ・センター・コンパット",
      "シガローネ・センター・ウルトラスリム",
      "シガローネ・センター・スーパースリム",
      "シガローネ・マグネット",
    ],
  );
});

test("device catalog covers mainstream heated and vapor hardware families", () => {
  const devices = rawProducts.filter((item) => item.type === "device");
  const deviceNames = devices.map((item) => `${item.jp} ${item.cn}`).join("\n");

  assert.equal(devices.length >= 24, true);
  for (const family of [
    /IQOS ILUMA i PRIME/i,
    /IQOS ILUMA i ONE/i,
    /IQOS 3 MULTI/i,
    /Ploom AURA/i,
    /Ploom CUBE/i,
    /with2/i,
    /Ploom X ADVANCED/i,
    /glo HYPER pro\+/i,
    /glo HYPER pro/i,
    /glo HYPER air/i,
    /glo Hilo/i,
    /lil HYBRID 3\.0/i,
    /RELX Infinity/i,
    /VAPORESSO XROS 5/i,
    /VAPORESSO XROS 5 Nano/i,
    /VAPORESSO XROS 4/i,
    /Uwell Caliburn G4 Pro/i,
    /Uwell Caliburn G4/i,
    /Voopoo Argus P3/i,
    /Voopoo Argus G3/i,
    /OXVA XLIM PRO 2 DNA/i,
    /OXVA XLIM GO 2/i,
    /OXVA XLIM SQ Pro 2/i,
    /Geekvape Wenax Q Ultra/i,
    /Geekvape Wenax Q2/i,
  ]) {
    assert.match(deviceNames, family);
  }
});

test("heated device entries carry source, status, and explicit sort metadata", () => {
  const heatedDeviceBrands = new Set(["IQOS", "Ploom", "glo", "lil HYBRID"]);
  const heatedDevices = rawProducts
    .map((item) => enrichProduct(item))
    .filter((item) => item.type === "device" && heatedDeviceBrands.has(item.brand));

  assert.equal(heatedDevices.length >= 30, true);
  for (const item of heatedDevices) {
    assert.match(item.source, /^https?:\/\//, `${item.jp} source`);
    assert.equal(Number.isFinite(Number(item.deviceOrder)), true, `${item.jp} deviceOrder`);
    assert.match(
      item.marketStatus,
      /^(current-mainstream|current-limited|legacy|discontinued-stock-only|discontinued)$/i,
      `${item.jp} marketStatus`,
    );
  }
});

test("all device entries carry explicit brand, source, status, and sort metadata", () => {
  const devices = rawProducts
    .map((item) => enrichProduct(item))
    .filter((item) => item.type === "device");

  for (const item of devices) {
    assert.match(item.brand, /\S/, `${item.jp} brand`);
    assert.match(item.source, /^https?:\/\//, `${item.jp} source`);
    assert.equal(Number.isFinite(Number(item.deviceOrder)), true, `${item.jp} deviceOrder`);
    assert.match(
      item.marketStatus,
      /^(current-mainstream|current-limited|legacy|discontinued-stock-only|discontinued|overseas-reference)$/i,
      `${item.jp} marketStatus`,
    );
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
  assert.match(config, /window\.location\.origin === productionOrigin/);
  assert.equal(packageJson.scripts["ai:local"], "node scripts/local-ai-proxy.mjs");
  assert.equal(existsSync(workflowPath), true);
  assert.equal(existsSync(localProxyPath), true);
  assert.equal(existsSync(startupScriptPath), true);
});

test("home page starts an AI proxy health check so the entry does not stay stale", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /updateAiEntryStatus\(\);\s*refreshAiHealth\(\);\s*renderAll\(\);/);
});

test("device sorting groups by brand and then machine generation", () => {
  const sorted = sortProducts(
    [
      enrichProduct({ type: "device", jp: "glo HYPER pro", cn: "glo HYPER pro", jpy: 3980 }),
      enrichProduct({ type: "device", jp: "IQOS イルマ i ワン", cn: "IQOS ILUMA i ONE", jpy: 3980 }),
      enrichProduct({ type: "device", jp: "IQOS イルマ i リミックスモデル", cn: "IQOS ILUMA i REMIX 限定款", jpy: 6980 }),
      enrichProduct({ type: "device", jp: "Ploom AURA", cn: "Ploom AURA", jpy: 2980 }),
      enrichProduct({ type: "device", jp: "Ploom CUBE", cn: "Ploom CUBE", jpy: 1980, deviceBrand: "Ploom", deviceOrder: 2020 }),
      enrichProduct({ type: "device", jp: "with2", cn: "with2 加热设备", jpy: 1980, deviceBrand: "Ploom", deviceOrder: 2400 }),
      enrichProduct({ type: "device", jp: "Ploom X ADVANCED", cn: "Ploom X ADVANCED", jpy: 1980 }),
      enrichProduct({ type: "device", jp: "Ploom X", cn: "Ploom X", jpy: 1980 }),
      enrichProduct({ type: "device", jp: "Ploom S 2.0", cn: "Ploom S 2.0", jpy: 3480 }),
      enrichProduct({ type: "device", jp: "IQOS イルマ i プライム", cn: "IQOS ILUMA i PRIME", jpy: 9980 }),
      enrichProduct({ type: "device", jp: "glo Hilo", cn: "glo Hilo", jpy: 1980 }),
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
      "IQOS ILUMA i REMIX 限定款",
      "IQOS ILUMA i ONE",
      "Ploom AURA",
      "Ploom CUBE",
      "with2 加热设备",
      "Ploom X ADVANCED",
      "Ploom X",
      "Ploom S 2.0",
      "glo HYPER pro",
      "glo Hilo",
      "glo HYPER air",
      "VAPORESSO XROS 5 主机",
      "VAPORESSO XROS 4 主机",
    ],
  );
});

test("IQOS remix devices are not misclassified as lil HYBRID MIIX products", () => {
  const remix = enrichProduct({
    type: "device",
    jp: "IQOS イルマ i プライム リミックスモデル",
    cn: "IQOS ILUMA i PRIME REMIX 限定款",
    jpy: 11980,
  });
  const miix = enrichProduct({
    type: "heated",
    jp: "lil HYBRID ミックス アイス",
    cn: "lil HYBRID 混合冰薄荷",
    jpy: 520,
  });

  assert.equal(remix.brand, "IQOS");
  assert.equal(remix.jpy, 11980);
  assert.equal(miix.brand, "lil HYBRID");
  assert.equal(miix.jpy, 560);
});

test("legacy Japanese cigarette names normalize to searchable brand groups", () => {
  const samples = [
    ["クール ブースト フレッシュ 8", "KOOL"],
    ["セーラム ブラックメンソール", "Salem"],
    ["ピアニッシモ アリア メンソール", "Pianissimo"],
    ["バージニア エス ロゼ メンソール", "Virginia S"],
    ["ホープ", "Hope"],
    ["わかば", "Wakaba"],
    ["エコー", "Echo"],
  ];

  for (const [jp, brand] of samples) {
    assert.equal(enrichProduct({ type: "cigarette", jp, cn: jp, jpy: 500 }).brand, brand);
  }
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

test("device and pod category pages ignore score sorts and keep brand-model order", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(
    source,
    /state\.category === "device" \|\| state\.category === "pod" \? "device" : state\.sort/,
  );
});

test("detail image source link labels match product media type", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(source, /function imageSourceLabel\(item\)/);
  assert.match(source, /item\.type === "device"/);
  assert.match(source, /查看设备图片来源/);
  assert.match(source, /item\.type === "pod"/);
  assert.match(source, /查看图片来源/);
  assert.match(source, /查看单包图片来源/);
  assert.match(source, /imageSourceLabel\(item\)/);
});

test("all device and pod catalog pages keep each brand in one contiguous block", () => {
  const products = rawProducts.map((item, index) => enrichProduct(item, index));

  for (const type of ["device", "pod"]) {
    const sorted = sortProducts(products.filter((item) => item.type === type), "device");
    const ranges = new Map();

    sorted.forEach((item, index) => {
      const range = ranges.get(item.brand) ?? { first: index, last: index };
      range.last = index;
      ranges.set(item.brand, range);
    });

    for (const [brand, range] of ranges) {
      const brandsInside = new Set(sorted.slice(range.first, range.last + 1).map((item) => item.brand));
      assert.deepEqual([...brandsInside], [brand], `${type}:${brand}`);
    }
  }
});

test("device and pod category feeds stay separated while device brands follow the hardware family order", () => {
  const products = rawProducts.map((item, index) => enrichProduct(item, index));
  const deviceFeed = sortProducts(filterProducts(products, { category: "device" }), "device");
  const podFeed = sortProducts(filterProducts(products, { category: "pod" }), "device");

  assert.ok(deviceFeed.every((item) => item.type === "device"));
  assert.ok(podFeed.every((item) => item.type === "pod"));
  assert.deepEqual(
    [...new Set(deviceFeed.map((item) => item.brand))],
    [
      "IQOS",
      "Ploom",
      "glo",
      "lil HYBRID",
      "RELX",
      "MOTI",
      "VAPORESSO",
      "Uwell",
      "Voopoo",
      "OXVA",
      "Geekvape",
    ],
  );
  assert.deepEqual(
    deviceFeed
      .filter((item) => item.brand === "VAPORESSO")
      .slice(0, 4)
      .map((item) => item.cn),
    [
      "VAPORESSO XROS 5 主机",
      "VAPORESSO XROS 5 Mini 主机",
      "VAPORESSO XROS 5 Nano 主机",
      "VAPORESSO XROS 4 主机",
    ],
  );
  assert.deepEqual(
    podFeed
      .filter((item) => item.brand === "VAPORESSO")
      .map((item) => item.cn),
    [
      "VAPORESSO XROS 网芯烟弹 0.6Ω",
      "VAPORESSO XROS 网芯烟弹 0.8Ω",
      "VAPORESSO XROS 网芯烟弹 1.0Ω",
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
  assert.match(source, /renderBrandJump/);
  assert.match(source, /brand-jump-chip/);
  assert.match(source, /按品牌\/型号排序/);
  assert.equal(source.includes("const brandKey = `${item.type}:${item.brand}`;"), true);
  assert.match(styles, /\.brand-section-card\s*\{/);
  assert.match(styles, /\.brand-jump\s*\{/);
  assert.match(styles, /grid-column:\s*1\s*\/\s*-1/);
});

test("AI dialog default copy reflects online proxy check without implying permanent outage", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /本地匹配可用 · 正在检查在线 MiniMax 代理/);
  assert.match(html, /在线代理不可用时不会上传/);
  assert.doesNotMatch(html, /在线 MiniMax 未连接，照片不会上传/);
  assert.doesNotMatch(html, /代理未配置时不会上传/);
});

test("device catalog and detail views expose readable market status badges", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(html, /class="market-status-badge"/);
  assert.match(source, /function marketStatusMeta/);
  assert.match(source, /现行主流/);
  assert.match(source, /限定在售/);
  assert.match(source, /旧款识别/);
  assert.match(source, /已停产/);
  assert.match(source, /海外参考/);
  assert.match(source, /detail-market-status/);
  assert.match(styles, /\.market-status-badge\s*\{/);
  assert.match(styles, /\.detail-market-status\s*\{/);
});

test("detail renderer labels non-verified reference images as not exact cartons", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(source, /这里还不是同 SKU 整条实拍/);
  assert.match(source, /非整条实拍/);
  assert.match(source, /没有 10 个同款外盒\/一カートン文字证据前/);
  assert.match(styles, /\.carton-integrity-warning\s*\{/);
  assert.match(styles, /\.carton-reference-gallery em\s*\{/);
});

test("detail hero exposes a compact pack and carton status strip", () => {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(source, /function mediaStatusStrip/);
  assert.match(source, /detail-media-status-strip/);
  assert.match(source, /href="#packageIdentity"/);
  assert.match(source, /一包图/);
  assert.match(source, /一条图/);
  assert.match(source, /已核验/);
  assert.match(source, /已拆分变体/);
  assert.match(source, /来源已记录/);
  assert.match(source, /待找整条/);
  assert.match(source, /relatedExactProducts/);
  assert.match(source, /data-related-product/);
  assert.match(source, /已拆分的准确款/);
  assert.match(source, /id="packageIdentity"/);
  assert.match(styles, /\.detail-media-status-strip\s*\{/);
  assert.match(styles, /\.related-exact-products\s*\{/);
  assert.match(styles, /backdrop-filter:\s*blur/);
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

test("dedicated ranking page renders a full SKU feed while home preview stays brand-only", () => {
  const rankingSource = readFileSync(new URL("../ranking.js", import.meta.url), "utf8");
  const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const rankingPoolSize = rawProducts
    .map((item, index) => enrichProduct(item, index))
    .filter(
      (item) =>
        item.type !== "device" &&
        item.type !== "pod" &&
        item.availability !== "discontinued",
    ).length;

  assert.equal(rankingPoolSize > 20, true);
  assert.doesNotMatch(rankingSource, /distinctBrandRanking/);
  assert.match(rankingSource, /const pool = rankingPool\(\)/);
  assert.match(rankingSource, /sortProducts\(pool, audience\)/);
  assert.match(rankingSource, /完整 SKU 信息流/);
  assert.match(rankingSource, /ranked\.length\} 款商品/);
  assert.match(appSource, /topDistinctBrands\(rankingPool\(\), sort, 4\)/);
});

test("dedicated ranking page can switch between full SKU and brand representative feeds", () => {
  const rankingHtml = readFileSync(new URL("../ranking.html", import.meta.url), "utf8");
  const rankingSource = readFileSync(new URL("../ranking.js", import.meta.url), "utf8");

  assert.match(rankingHtml, /data-ranking-mode="sku"/);
  assert.match(rankingHtml, /完整 SKU 榜/);
  assert.match(rankingHtml, /data-ranking-mode="brand"/);
  assert.match(rankingHtml, /品牌代表榜/);
  assert.match(rankingSource, /topDistinctBrands/);
  assert.match(rankingSource, /let rankingMode = initialMode === "brand" \? "brand" : "sku"/);
  assert.match(rankingSource, /rankingMode === "brand"/);
  assert.match(rankingSource, /品牌代表榜/);
  assert.match(rankingSource, /完整 SKU 榜/);
  assert.match(rankingSource, /url\.searchParams\.set\("mode", rankingMode\)/);
});

test("maps and electronic product entry points expose lightweight Japanese compliance guidance", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");

  assert.match(html, /id="mapComplianceNotice"/);
  assert.match(html, /传统烟可用 Google 地图找烟草店/);
  assert.match(html, /电子烟\/烟弹需确认日本法规和门店实际销售/);
  assert.match(source, /function updateComplianceNotice/);
  assert.match(source, /state\.category === "device" \|\| state\.category === "pod"/);
  assert.match(source, /mapComplianceNotice/);
});

test("ranking page uses a slightly wider but bounded desktop feed", () => {
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.ranking-main\s*\{[\s\S]*width:\s*min\(100%,\s*960px\)/);
  assert.match(styles, /@media\s*\(min-width:\s*1080px\)[\s\S]*\.ranking-main\s*\{[\s\S]*width:\s*min\(100%,\s*1040px\)/);
  assert.match(styles, /@media\s*\(min-width:\s*1080px\)[\s\S]*\.ranking-feed-card\s*\{[\s\S]*grid-template-columns:\s*66px 122px minmax\(0,\s*1fr\) 78px/);
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
